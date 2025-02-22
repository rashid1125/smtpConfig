<?php
/**
 * File FunctionsTrait
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

use App\Events\ModelCreated;
use App\Events\ModelUpdated;
use App\Exceptions\UserAlertException;
use App\Models\AccountsLedger;
use App\Models\BankPayment;
use App\Models\BankReceive;
use App\Models\CashPayment;
use App\Models\CashReceive;
use App\Models\ChequeIssue;
use App\Models\ChequeReceive;
use App\Models\Company;
use App\Models\ExportModules\CommercialInvoice;
use App\Models\Inventory\OpeningStock;
use App\Models\InventoryGatePass\DeliveryChallan;
use App\Models\InventoryGatePass\Inspection;
use App\Models\InventoryGatePass\InwardGatePass;
use App\Models\InventoryGatePass\ReturnInward;
use App\Models\InventoryGatePass\ReturnOutward;
use App\Models\Journal;
use App\Models\Payroll\AdvanceReturn;
use App\Models\Payroll\Attendance;
use App\Models\Payroll\Incentive;
use App\Models\Payroll\Loan;
use App\Models\Payroll\LoanReturn;
use App\Models\Payroll\OverTime;
use App\Models\Payroll\Penalty;
use App\Models\Payroll\SalarySheetPermanent;
use App\Models\Payroll\StaffAdvance;
use App\Models\Production\Consumption;
use App\Models\Purchase;
use App\Models\PurchaseOrder;
use App\Models\PurchaseReturn;
use App\Models\RoleGroup;
use App\Models\Sales\CashSaleInvoice;
use App\Models\Sales\SaleInvoice;
use App\Models\Sales\SaleOrder;
use App\Models\Sales\SaleReturnInvoice;
use App\Models\SettingConfiguration;
use App\Models\TransactionAccount\CashBook;
use App\Models\TransactionAccount\CreditNote;
use App\Models\TransactionAccount\DebitNote;
use App\Models\TransactionAccount\OpeningBalance;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

trait FunctionsTrait
{
    /**
     * Function getAccountBalanceById
     *
     * @param int      $accountId
     * @param string   $currentDate
     * @param int|null $companyId
     * @param int|null $financialYearId
     *
     * @throws \Exception
     *
     * @return object|null
     */
    public static function getAccountBalanceById(int $accountId, string $currentDate, ?int $companyId, ?int $financialYearId): ?object
    {
        $companyId       = $companyId ?? self::getCompanyId();
        $financialYearId = $financialYearId ?? self::getFinancialYearId();
        if (empty($accountId)) {
            throw new Exception('Account ID is required');
        }
        if (! is_numeric($accountId)) {
            throw new Exception('Invalid Account ID');
        }
        if (empty($companyId) || empty($financialYearId)) {
            throw new Exception('Company ID or Financial Year ID is missing');
        }
        $subQueryOpening = self::buildOpeningSubQuery($accountId, $currentDate, $companyId, $financialYearId);
        $subQueryDebit   = self::buildDebitSubQuery($accountId, $currentDate, $companyId, $financialYearId);
        $subQueryCredit  = self::buildCreditSubQuery($accountId, $currentDate, $companyId, $financialYearId);
        $subQueryClosing = self::buildClosingSubQuery($accountId, $currentDate, $companyId, $financialYearId);
        $unionQuery      = $subQueryOpening->unionAll($subQueryDebit)->unionAll($subQueryCredit)->unionAll($subQueryClosing);

        return DB::table(DB::raw("({$unionQuery->toSql()}) as sub"))->selectRaw('SUM(opening) as opening, SUM(debit) as debit, SUM(credit) as credit, SUM(closing) as closing')->mergeBindings($subQueryOpening)->first();
    }

    /**
     * Function buildOpeningSubQuery
     *
     * @param $accountId
     * @param $currentDate
     * @param $companyId
     * @param $financialYearId
     *
     * @return \Illuminate\Database\Query\Builder
     */
    private static function buildOpeningSubQuery($accountId, $currentDate, $companyId, $financialYearId): Builder
    {
        return DB::table(AccountsLedger::tableName())->selectRaw('SUM(' . AccountsLedger::ACCOUNT_LEDGER_DEBIT . ') - SUM(' . AccountsLedger::ACCOUNT_LEDGER_CREDIT . ') as opening, 0 as debit, 0 as credit, 0 as closing')->where(AccountsLedger::ACCOUNT_LEDGER_VRDATE, '<', $currentDate)->where(AccountsLedger::ACCOUNT_LEDGER_PID, $accountId)->where(AccountsLedger::ACCOUNT_LEDGER_COMPANY_ID, $companyId)->where(AccountsLedger::ACCOUNT_LEDGER_FN_ID, $financialYearId);
    }

    /**
     * Function buildDebitSubQuery
     *
     * @param $accountId
     * @param $currentDate
     * @param $companyId
     * @param $financialYearId
     *
     * @return \Illuminate\Database\Query\Builder
     */
    private static function buildDebitSubQuery($accountId, $currentDate, $companyId, $financialYearId): Builder
    {
        return DB::table(AccountsLedger::tableName())->selectRaw('0 as opening, SUM(' . AccountsLedger::ACCOUNT_LEDGER_DEBIT . ') as debit, 0 as credit, 0 as closing')->where(AccountsLedger::ACCOUNT_LEDGER_VRDATE, $currentDate)->where(AccountsLedger::ACCOUNT_LEDGER_PID, $accountId)->where(AccountsLedger::ACCOUNT_LEDGER_COMPANY_ID, $companyId)->where(AccountsLedger::ACCOUNT_LEDGER_FN_ID, $financialYearId);
    }

    /**
     * Function buildCreditSubQuery
     *
     * @param $accountId
     * @param $currentDate
     * @param $companyId
     * @param $financialYearId
     *
     * @return \Illuminate\Database\Query\Builder
     */
    private static function buildCreditSubQuery($accountId, $currentDate, $companyId, $financialYearId): Builder
    {
        return DB::table(AccountsLedger::tableName())->selectRaw('0 as opening, 0 as debit, SUM(' . AccountsLedger::ACCOUNT_LEDGER_CREDIT . ') as credit, 0 as closing')->where(AccountsLedger::ACCOUNT_LEDGER_VRDATE, $currentDate)->where(AccountsLedger::ACCOUNT_LEDGER_PID, $accountId)->where(AccountsLedger::ACCOUNT_LEDGER_COMPANY_ID, $companyId)->where(AccountsLedger::ACCOUNT_LEDGER_FN_ID, $financialYearId);
    }

    /**
     * Function buildClosingSubQuery
     *
     * @param $accountId
     * @param $currentDate
     * @param $companyId
     * @param $financialYearId
     *
     * @return \Illuminate\Database\Query\Builder
     */
    private static function buildClosingSubQuery($accountId, $currentDate, $companyId, $financialYearId): Builder
    {
        return DB::table(AccountsLedger::tableName())->selectRaw('0 as opening, 0 as debit, 0 as credit, SUM(' . AccountsLedger::ACCOUNT_LEDGER_DEBIT . ') - SUM(' . AccountsLedger::ACCOUNT_LEDGER_CREDIT . ') as closing')->where(AccountsLedger::ACCOUNT_LEDGER_VRDATE, '<=', $currentDate)->where(AccountsLedger::ACCOUNT_LEDGER_PID, $accountId)->where(AccountsLedger::ACCOUNT_LEDGER_COMPANY_ID, $companyId)->where(AccountsLedger::ACCOUNT_LEDGER_FN_ID, $financialYearId);
    }

    /**
     * Function getDaysInMonth
     *
     * @param $month
     * @param $year
     *
     * @return int
     */
    public static function getDaysInMonth($month, $year): int
    {
        return Carbon::createFromDate($year, $month)->daysInMonth;
    }

    /**
     * Function generateAttendanceTable
     *
     * @param $data
     * @param $days
     *
     * @return array
     */
    public static function generateAttendanceTable($data, $days): array
    {
        if (empty($data)) {
            return [];
        }
        $tableRows  = [];
        $staff_name = "";
        $dept_name  = "";
        $counter    = 1;
        foreach ($data as $elem) {
            if ($elem->staff_name !== $staff_name) {
                $cols = array_fill(1, $days, "-");
                foreach ($data as $el) {
                    if (strtolower($el->staff_name) === strtolower($elem->staff_name)) {
                        $cols[$el->day] = match (strtolower($el->status)) {
                            'absent'         => 'A',
                            'gusted holiday' => 'GH',
                            'outdoor'        => 'O',
                            'paid leave'     => 'PL',
                            'present'        => 'P',
                            'rest day'       => 'RD',
                            'short leave'    => 'SL',
                            default          => '-',
                        };
                    }
                }
                if (strtolower($elem->dept_name) !== strtolower($dept_name)) {
                    $tableRows[] = [
                        'type'    => 'header',
                        'content' => $elem->dept_name,
                        'colspan' => $days + 2
                    ];
                    $dept_name   = $elem->dept_name;
                }
                $row         = [
                    'type'       => 'staff',
                    'counter'    => $counter++,
                    'staff_id'   => $elem->staid,
                    'staff_name' => $elem->staff_name,
                    'attendance' => $cols
                ];
                $tableRows[] = $row;
                $staff_name  = $elem->staff_name;
            }
        }

        return $tableRows;
    }

    /**
     * Function handleBootedCreating
     *
     * @param $instance
     */
    protected static function handleBootedCreating($instance): void
    {
        self::handleCommonBootedLogic($instance);
        $instance->created_by = self::getUserId();
        $instance->created_at = Carbon::now();
        event(new ModelCreated($instance, $instance->toArray()));
    }

    /**
     * Function handleCommonBootedLogic
     *
     * @param $instance
     */
    private static function handleCommonBootedLogic($instance): void
    {
        self::parseAndSetDate($instance, 'vrdate');
        self::parseAndSetDate($instance, 'from_date');
        self::parseAndSetDate($instance, 'to_date');
        self::parseAndSetDate($instance, 'due_date');
        self::parseAndSetDate($instance, 'bilty_date');
        $instance->uid        = self::getUserId();
        $instance->company_id = self::getCompanyId();
        if (Schema::hasColumn(static::tableName(), 'fn_id')) {
            $instance->fn_id = self::getFinancialYearId();
        }
        if (Schema::hasColumn(static::tableName(), 'financial_year_id')) {
            $instance->financial_year_id = self::getFinancialYearId();
        }
        if (Schema::hasColumn(static::tableName(), 'is_post')) {
            $instance->is_post = static::hasSupervision(static::tableName());
        }
    }

    /**
     * Function parseAndSetDate
     *
     * @param $instance
     * @param $property
     */
    private static function parseAndSetDate($instance, $property): void
    {
        if (isset($instance->$property) && $instance->$property) {
            $instance->$property = self::parseDate($instance->$property) ?? Carbon::now();
        } elseif (isset($instance->$property)) {
            $instance->$property = Carbon::now();
        }
    }

    /**
     * Function handleBootedUpdating
     *
     * @param $instance
     */
    protected static function handleBootedUpdating($instance): void
    {
        self::handleCommonBootedLogic($instance);
        $instance->updated_by = self::getUserId();
        $instance->updated_at = Carbon::now();
        event(new ModelUpdated($instance, $instance->toArray()));
    }

    /**
     * Function doesEtypeMatchTableName
     *
     * @param string $etype
     * @param        $instance
     *
     * @throws \App\Exceptions\UserAlertException
     * @return bool
     */
    protected static function doesEtypeMatchTableName(string $etype, $instance): bool
    {
        if (! method_exists($instance, 'tableName')) {
            throw new UserAlertException("The method 'tableName' is not defined or the given model does not extend from BaseModel.", 400);
        }
        $etype   = strtolower($etype);
        $tblName = strtolower($instance::tableName());
        if ($tblName === $etype) {
            return true;
        }

        return false;
    }

    /**
     * Function getPrintTitlePdf
     *
     * @return array[]
     */
    protected static function getPrintTitlePdf(): array
    {
        return [
            AdvanceReturn::class        => ['title' => 'Staff Advance Return Voucher', 'vrtype' => 'ARV #'],
            Attendance::class           => ['title' => 'Attendance Voucher', 'vrtype' => 'AV #'],
            BankPayment::class          => ['title' => 'Bank Payment Voucher', 'vrtype' => 'BPV #'],
            BankReceive::class          => ['title' => 'Bank Receive Voucher', 'vrtype' => 'BR#'],
            CashBook::class             => ['title' => 'Cash Book Voucher', 'vrtype' => 'CBV#'],
            CashPayment::class          => ['title' => 'Cash Payment Voucher', 'vrtype' => 'CP#'],
            CashReceive::class          => ['title' => 'Cash Receive Voucher', 'vrtype' => 'CRV#'],
            CashSaleInvoice::class      => ['title' => 'Cash Sale Voucher', 'vrtype' => 'CSV #'],
            ChequeIssue::class          => ['title' => 'Cheque Issue Voucher', 'vrtype' => 'CI#'],
            ChequeReceive::class        => ['title' => 'Cheque Receive Voucher', 'vrtype' => 'CR#'],
            Consumption::class          => ['title' => 'Consumption Voucher', 'vrtype' => 'Consumption #'],
            CommercialInvoice::class    => ['title' => 'Commercial Invoice Voucher', 'vrtype' => 'CI #'],
            CreditNote::class           => ['title' => 'Credit Note Voucher', 'vrtype' => 'CN#'],
            DebitNote::class            => ['title' => 'Debit Note Voucher', 'vrtype' => 'DN#'],
            DeliveryChallan::class      => ['title' => 'Outward Gate Pass Voucher', 'vrtype' => 'OGP #'],
            Incentive::class            => ['title' => 'Incentive Voucher', 'vrtype' => 'INV #'],
            Inspection::class           => ['title' => 'Inspection Voucher', 'vrtype' => 'IV #'],
            InwardGatePass::class       => ['title' => 'Inward Gate Pass Voucher', 'vrtype' => 'IGP #'],
            Journal::class              => ['title' => 'Journal Voucher', 'vrtype' => 'JV#'],
            Loan::class                 => ['title' => 'Staff Loan Voucher', 'vrtype' => 'SLV #'],
            LoanReturn::class           => ['title' => 'Staff Loan Return Voucher', 'vrtype' => 'LRV #'],
            OpeningBalance::class       => ['title' => 'Opening Balance Voucher', 'vrtype' => 'OB#'],
            OpeningStock::class         => ['title' => 'Opening Stock Voucher', 'vrtype' => 'OS#'],
            Penalty::class              => ['title' => 'Penalty Voucher', 'vrtype' => 'PV #'],
            Purchase::class             => ['title' => 'Purchase Voucher', 'vrtype' => 'PV#'],
            PurchaseOrder::class        => ['title' => 'Purchase Order Voucher', 'vrtype' => 'PO#'],
            PurchaseReturn::class       => ['title' => 'Purchase Return Voucher', 'vrtype' => 'PRV#'],
            ReturnInward::class         => ['title' => 'Return Inward Voucher', 'vrtype' => 'RIV #'],
            ReturnOutward::class        => ['title' => 'Return Outward', 'vrtype' => 'RO#'],
            SaleInvoice::class          => ['title' => 'Sale Voucher', 'vrtype' => 'SI#'],
            SaleOrder::class            => ['title' => 'Sale Order', 'vrtype' => 'SO#'],
            SaleReturnInvoice::class    => ['title' => 'Sale Return Voucher', 'vrtype' => 'SRV #'],
            StaffAdvance::class         => ['title' => 'Staff Advance Voucher', 'vrtype' => 'SAV #'],
            OverTime::class             => ['title' => 'Over Time Voucher', 'vrtype' => 'OTV #'],
            SalarySheetPermanent::class => ['title' => 'Salary Sheet Permanent Voucher', 'vrtype' => 'SSPV #'],
        ];
    }

    public function loadCommonData(array $sendingData, $contentView): array
    {
        $data            = [
            'setting_configure' => SettingConfiguration::all(),
            'companies'         => Company::where(['company_id' => self::getCompanyId()])->first(),
        ];
        $data            = array_merge($sendingData, $data);
        $data['header']  = view('layouts.header', $data);
        $data['content'] = view($contentView, $data);
        $data['mainnav'] = view('layouts.mainnav', $data);
        $data['footer']  = view('layouts.footer', $data);

        return $data;
    }

    /**
     * Function verifyEmail
     *
     * @param array $emails
     *
     * @throws \App\Exceptions\UserAlertException
     *
     * @return bool
     */
    public function verifyEmail(array $emails): bool
    {
        if (empty($emails)) {
            throw new UserAlertException("Email list cannot be empty", 400);
        }
        $whitelistedDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'digitalsofts.com', 'icloud.com'];
        foreach ($emails as $email) {
            if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                throw new UserAlertException("Invalid email format: {$email}", 400);
            }
            $domain = substr(strrchr($email, "@"), 1);
            if (! in_array($domain, $whitelistedDomains)) {
                throw new UserAlertException("Invalid email host : {$email}", 400);
            }
            $domain = substr(strrchr($email, "@"), 1);
            if (! $this->domainHasMXRecord($domain)) {
                throw new UserAlertException("Invalid email domain: {$email}", 400);
            }
            if (! $this->smtpVerifyEmail($email)) {
                throw new UserAlertException("Email address does not exist: {$email}", 400);
            }
        }

        return true;
    }

    /**
     * Function domainHasMXRecord
     *
     * @param string $domain
     *
     * @return bool
     */
    private function domainHasMXRecord(string $domain): bool
    {
        $records = dns_get_record($domain, DNS_MX);

        return ! empty($records);
    }

    /**
     * Function smtpVerifyEmail
     *
     * @param string $email
     *
     * @throws \Exception
     *
     * @return bool
     */
    private function smtpVerifyEmail(string $email): bool
    {
        $domain  = substr(strrchr($email, "@"), 1);
        $records = dns_get_record($domain, DNS_MX);
        if (! $records) {
            throw new UserAlertException("No MX records found for the domain");
        }
        $mx         = $records[0]['target'];
        $connection = @fsockopen($mx, 25, $errno, $errstr, 10); // 10 seconds timeout
        if (! $connection) {
            throw new UserAlertException("Could not connect to email server: {$errstr} ({$errno})");
        }
        $response = fgets($connection, 1024);
        if (strpos($response, '220') === false) {
            fclose($connection);
            throw new UserAlertException("Unexpected SMTP response: $response");
        }
        // Proceed with HELO command
        fwrite($connection, "HELO $mx\r\n");
        $response = fgets($connection, 1024);
        if (strpos($response, '250') === false) {
            fclose($connection);
            throw new UserAlertException("HELO command failed: $response");
        }
        // MAIL FROM command
        fwrite($connection, "MAIL FROM: <check@example.com>\r\n");
        $response = fgets($connection, 1024);
        if (strpos($response, '250') === false) {
            fclose($connection);
            throw new UserAlertException("MAIL FROM command failed: $response");
        }
        // RCPT TO command
        fwrite($connection, "RCPT TO: <$email>\r\n");
        $response = fgets($connection, 1024);
        fclose($connection);
        if (strpos($response, '250') !== false) {
            return true;
        } elseif (strpos($response, '550') !== false) {
            return false;
        } else {
            throw new UserAlertException("Unexpected SMTP response: $response");
        }
    }

    /**
     * Function ensureDeveloperRights
     *
     * @param string $voucherRights
     *
     * @return bool
     */
    protected function ensureDeveloperRights(string $voucherRights): bool
    {
        $user = User::find(Auth::id());
        if ($user->hasRoleGroup(IS_ROLE_ADMIN)) {
            $roleGroupId = $user->rgid;
            $roleGroup   = RoleGroup::find($roleGroupId);
            if ($roleGroup) {
                $permissions = json_decode($roleGroup->desc, true) ? : [];
                if (! isset($permissions['vouchers'][$voucherRights])) {
                    $permissions['vouchers'][$voucherRights] = [
                        $voucherRights => 1,
                        'insert'       => 1,
                        'update'       => 1,
                        'delete'       => 1,
                        'print'        => 1,
                    ];
                }
                $roleGroup->desc = json_encode($permissions, JSON_PRETTY_PRINT);
                $roleGroup->save();

                return true;
            }
        }

        return false;
    }

    /**
     * Function numVal
     *
     * @param     $val
     * @param int $rounding
     *
     * @return float
     */
    protected function numVal($val, int $rounding = 0): float
    {
        return round(floatval($val), $rounding);
    }

    /**
     * Function convertToCamelCase
     *
     * @param string $key
     *
     * @return string
     */
    protected function convertToCamelCase(string $key): string
    {
        $key = str_replace(' ', '', ucwords(str_replace('_', ' ', $key)));

        return lcfirst($key);
    }

    /**
     * Function convertCamelCaseToReadable
     *
     * @param string $key
     *
     * @return string
     */
    protected function convertCamelCaseToReadable(string $key): string
    {
        return ucfirst(preg_replace('/([a-z])([A-Z])/', '$1 $2', $key));
    }

    /**
     * Function convertUnderscoreToReadable
     *
     * @param string $key
     *
     * @return string
     */
    protected function convertUnderscoreToReadable(string $key): string
    {
        return ucwords(str_replace('_', ' ', $key));
    }

    /**
     * Function getDuration
     *
     * @param $fromDate
     * @param $toDate
     *
     * @return float
     */
    protected function getDuration($fromDate, $toDate): float
    {
        $startDate = Carbon::parse($fromDate);
        $endDate   = Carbon::parse($toDate);

        return $startDate->diffInDays($endDate);
    }
}
