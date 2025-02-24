<?php
// LedgerDetailsTrait.php
namespace App\Traits;

use App\Enums\DecimalRounding;
use App\Exceptions\UserAlertException;
use App\Models\AccountsLedger;
use App\Models\SettingConfiguration;
use Symfony\Component\HttpFoundation\Response;

trait LedgerDetailsTrait
{
    public function saveLedgerDetails($instance, array $ledgerDetails, $relationshipName)
    {
        $ledgers = [];
        $balance = 0;
        foreach ($ledgerDetails as $ledgerDetail) {
            $accountsLedgers = new AccountsLedger();
            $accountsLedgers->fill($ledgerDetail);
            $balance += $accountsLedgers->debit - $accountsLedgers->credit;
            if ((float)$accountsLedgers->debit > 0 || (float)$accountsLedgers->credit > 0) {
                $ledgers[] = $accountsLedgers;
            }
        }
        $roundedBalance = round($balance, DecimalRounding::getAmountRounding());
        if ($roundedBalance > 0) {
            $roundOffLedger                 = new AccountsLedger();
            $roundOffAccount                = SettingConfiguration::first();
            $roundOffLedger['vrnoa']        = $ledgerDetail['vrnoa'];
            $roundOffLedger['vrdate']       = $ledgerDetail['vrdate'];
            $roundOffLedger['debit']        = (float)$roundedBalance < 0 ? (float)(abs($roundedBalance)) : 0;
            $roundOffLedger['credit']       = (float)$roundedBalance > 0 ? (float)(abs($roundedBalance)) : 0;
            $roundOffLedger['description']  = 'Round Off Account Adjustment';
            $roundOffLedger['description2'] = 'Round Off Account Adjustment';
            $roundOffLedger['pid']          = $roundOffAccount->roundoffaccount;
            $roundOffLedger['pid_key']      = $roundOffAccount->roundoffaccount;
            $ledgers[] = $roundOffLedger;
        }
        if ($ledgers) {
            return $instance->$relationshipName()->saveMany($ledgers);
        }
        throw new UserAlertException("No valid ledger entries to save. Please check the provided ledger details.", Response::HTTP_NOT_IMPLEMENTED);
    }
}
