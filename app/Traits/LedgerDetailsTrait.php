<?php
/**
 * File LedgerDetailsTrait
 *
 * @package   App\Traits
 *
 * @author    Rashid Rasheed <rashidrasheed1125@gmail.com>
 *
 * @copyright Shahid & Rashid (SR)
 * @version   1.0
 */
declare(strict_types = 1);
namespace App\Traits;

use App\Enums\DecimalRounding;
use App\Exceptions\UserAlertException;
use App\Models\AccountsLedger;
use App\Models\SettingConfiguration;
use Illuminate\Database\Eloquent\Model;

trait LedgerDetailsTrait
{
    /**
     * Function saveLedgerDetails
     *
     * @param \Illuminate\Database\Eloquent\Model $instance
     * @param array|object                        $ledgerDetails
     * @param string                              $relationshipName
     *
     * @throws \App\Exceptions\UserAlertException
     * @return mixed
     */
    public function saveLedgerDetails(Model $instance, array | object $ledgerDetails, string $relationshipName): mixed
    {
        if (empty($ledgerDetails)) {
            throw new UserAlertException("No ledger details provided to save.", 400);
        }
        if (empty($relationshipName)) {
            throw new UserAlertException("No relationship name provided to save ledger details.", 400);
        }
        $ledgers = [];
        $balance = 0;
        foreach ($ledgerDetails as $ledgerDetail) {
            $accountsLedgers = new AccountsLedger();
            $accountsLedgers->fill($ledgerDetail);
            $balance += $accountsLedgers->{AccountsLedger::ACCOUNT_LEDGER_DEBIT} - $accountsLedgers->{AccountsLedger::ACCOUNT_LEDGER_CREDIT};
            if ((float)$accountsLedgers->{AccountsLedger::ACCOUNT_LEDGER_DEBIT} > 0 || (float)$accountsLedgers->{AccountsLedger::ACCOUNT_LEDGER_CREDIT} > 0) {
                $ledgers[] = $accountsLedgers;
            }
        }
        $roundedBalance = round($balance, DecimalRounding::getAmountRounding());
        if ($roundedBalance > 0) {
            $roundOffLedger                 = new AccountsLedger();
            $roundOffAccount                = SettingConfiguration::first();
            $roundOffLedger['vrnoa']        = $ledgerDetail[AccountsLedger::ACCOUNT_LEDGER_VRNOA];
            $roundOffLedger['vrdate']       = $ledgerDetail[AccountsLedger::ACCOUNT_LEDGER_VRDATE];
            $roundOffLedger['debit']        = ($roundedBalance < 0) ? (float)(abs($roundedBalance)) : 0;
            $roundOffLedger['credit']       = ($roundedBalance > 0) ? (float)(abs($roundedBalance)) : 0;
            $roundOffLedger['description']  = 'Round Off Account Adjustment';
            $roundOffLedger['description2'] = 'Round Off Account Adjustment';
            $roundOffLedger['pid']          = $roundOffAccount->roundoffaccount;
            $roundOffLedger['pid_key']      = $roundOffAccount->roundoffaccount;
            $ledgers[]                      = $roundOffLedger;
        }
        if ($ledgers) {
            return $instance->$relationshipName()->saveMany($ledgers);
        }
        throw new UserAlertException("No valid ledger entries to save. Please check the provided ledger details.");
    }
}
