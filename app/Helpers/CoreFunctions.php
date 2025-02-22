<?php

use App\Models\SettingConfiguration;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

function getSettingDateFormat($col = 'date_format_php')
{
    $settingConfiguration = SettingConfiguration::select($col)->first();

    return $settingConfiguration->$col;
}

function fetchSetting_configurations()
{
    return SettingConfiguration::all();
}

/**
 * formatDateBySetting
 *
 * @param mixed $date
 *
 * @return string
 */
function formatDateBySetting($date)
{
    if ($date) {
        $format = getSettingDateFormat();

        return Carbon::parse($date)->format($format);
    }

    return '';
}

function getObjectToArray($object)
{
    return @json_decode(json_encode($object), true);
}

function _getBase64UrlEncode($input)
{
    return strtr(base64_encode($input), 'Pass@3210$%A987654321RashidC987654321AliD123456789Mughal+/', '._-');
}

function urlsafeB64Encode($input)
{
    // Retrieve application key from .env
    $appKey = env('APP_KEY');

    // Use the application key for encoding
    return Str::of(base64_encode($input . $appKey))->replace(['+', '/', '='], ['-', '_', ''])->__toString();
}

/**
 * handleForm
 *
 * @param string $settingColumnName
 *
 * @return bool|array|string
 */
function handleForm($settingColumnName)
{
    $settingConfiguration = SettingConfiguration::with('dateCloseOption')->first();
    $postingMethod        = $settingConfiguration->$settingColumnName;
    switch ($settingColumnName) {
        case 'purchase_posting':
            return handlePurchasePosting($postingMethod);
        case 'purchase_return_posting':
            return handlePurchaseReturnPosting($postingMethod);
        case 'sale_posting':
            return handleSalePosting($postingMethod);
        default:
            return false;
    }
}

function isModuleAccessible($settingColumnName, $voucherType = "")
{
    $data = handleForm($settingColumnName);
    $flag = false;
    if (isset($data['inward']) && $data['inward'] && $voucherType === "inward_gate_passes") {
        $flag = true;
    } else {
        if (isset($data['inspection']) && $data['inspection'] && $voucherType === "inspections") {
            $flag = true;
        } else {
            if (isset($data['returnOutward']) && $data['returnOutward'] && $voucherType === "return_outwards") {
                $flag = true;
            }
        }
    }

    return $flag;
}

function handlePurchasePosting($postingMethod)
{
    $purchase   = false;
    $inward     = false;
    $inspection = false;
    if ((int)$postingMethod == 2) {
        $inward = true;
    } else {
        if ((int)$postingMethod == 3) {
            $inspection = true;
            $inward     = true;
        }
    }

    return [
        'purchase'   => $purchase,
        'inward'     => $inward,
        'inspection' => $inspection
    ];
}

function handlePurchaseReturnPosting($postingMethod)
{
    $purchaseReturn = false;
    $returnOutward  = false;
    if ((int)$postingMethod == 2) {
        $returnOutward = true;
    }

    return [
        'purchaseReturn' => $purchaseReturn,
        'returnOutward'  => $returnOutward
    ];
}

function handleSalePosting($postingMethod)
{
    switch ($postingMethod) {
        case 1:
            // Logic for handling Direct Purchase
            return false;
        case 2:
            // Logic for handling Inward Then Purchase
            return true;
    }
}

function getItemActiveLoadCondition(int $Active, $Crit = ""): ?string
{
    if ((int)$Active === 1) {
        $Crit = " AND items.active='1'";
    } else {
        if ((int)$Active === 0) {
            $Crit = " AND items.active='0'";
        }
    }

    return $Crit;
}

function getItemTypeLoadCondition(int $Item_Type, $Crit = ""): ?string
{
    if ((int)$Item_Type === 1) {
        $Crit = " AND items.item_type='1'";
    } else {
        if ((int)$Item_Type === 0) {
            $Crit = " AND items.item_type='0'";
        }
    }

    return $Crit;
}

function getItemSettingLoadConditionCategorySubCategoryBrand(string $Setting_Column = "", string $Item_Column = "", $Crit = "")
{
    $Setting_Configure = fetchSetting_configurations();
    if ($Setting_Column !== "") {
        if ($Setting_Configure[0][$Setting_Column] > 0) {
            $Crit = foreachcrit($Setting_Configure[0][$Setting_Column]);
            if ($Crit !== "") {
                $Crit = " AND items.{$Item_Column} IN  ({$Crit})";
            }
        }
    }

    return $Crit;
}

function foreachcrit($string)
{
    $stringArray = explode(',', $string);
    $array       = "";
    foreach ($stringArray as $value) {
        $array .= "'" . $value . "',";
    }
    $array = substr($array, 0, -1);

    return $array;
}

/**
 * Tests if a string is a valid MySQL date and returns the date in the SQL format.
 *
 * @param string   date to check
 *
 * @return  string   date in the SQL format
 */
function getIsAlreadyMysqlDate($date)
{
    $d = preg_match('#^(?P<year>\d{2}|\d{4})([- /.])(?P<month>\d{1,2})\2(?P<day>\d{1,2})$#', $date, $matches) && checkdate($matches['month'], $matches['day'], $matches['year']);
    if ($d) {
        return formatDateToSql($date);
    } else {
        return convertDateToSql($date);
    }
}

/**
 * Converts a date to the SQL format (YYYY-MM-DD).
 *
 * @param string   date to convert
 *
 * @return  string   date in the SQL format
 */
function convertDateToSql($date)
{
    return date('Y-m-d', strtotime($date));
}

/**
 * Formats a date to the SQL format (YYYY-MM-DD).
 *
 * @param string   date to format
 *
 * @return  string   date in the SQL format
 */
function formatDateToSql($date)
{
    return date('Y-m-d', strtotime($date));
}

function convert_number_to_words($number, $lang = 'English')
{
    // Remove commas from the number string
    $number = str_replace(',', '', $number);
    if ($lang == 'urdu') {
        $string = convert_number_to_urdu_words($number);

        return $string;
    }
    $hyphen      = '-';
    $conjunction = $lang == 'English' ? ' and ' : ' اور ';
    $separator   = ', ';
    $negative    = $lang == 'English' ? 'negative ' : 'منفی ';
    $decimal     = $lang == 'English' ? ' point ' : ' اشاریہ ';
    $dictionary  = $lang == 'English' ? getEngNumberInWordsDict() : getUrduNumberInWordsDict();
    if (! is_numeric($number)) {
        return false;
    }
    if (($number >= 0 && (int)$number < 0) || (int)$number < 0 - PHP_INT_MAX) {
        // overflow
        trigger_error(
            'convert_number_to_words only accepts numbers between -' . PHP_INT_MAX . ' and ' . PHP_INT_MAX,
            E_USER_WARNING
        );

        return false;
    }
    if ($number < 0) {
        return $negative . convert_number_to_words(abs($number), $lang);
    }
    $string = $fraction = null;
    if (strpos($number, '.') !== false) {
        [$number, $fraction] = explode('.', $number);
    }
    switch (true) {
        case $number < 21:
            $string = $dictionary[$number];
            break;
        case $number < 100:
            $tens   = ((int)($number / 10)) * 10;
            $units  = $number % 10;
            $string = $dictionary[$tens];
            if ($units) {
                $string .= $hyphen . $dictionary[$units];
            }
            break;
        case $number < 1000:
            $hundreds  = $number / 100;
            $remainder = $number % 100;
            $string    = $dictionary[$hundreds] . ' ' . $dictionary[100];
            if ($remainder) {
                $string .= $conjunction . convert_number_to_words($remainder, $lang);
            }
            break;
        default:
            $baseUnit     = pow(1000, floor(log($number, 1000)));
            $numBaseUnits = (int)($number / $baseUnit);
            $remainder    = $number % $baseUnit;
            $string       = convert_number_to_words($numBaseUnits, $lang) . ' ' . $dictionary[$baseUnit];
            if ($remainder) {
                $string .= $remainder < 100 ? $conjunction : $separator;
                $string .= convert_number_to_words($remainder, $lang);
            }
            break;
    }
    if (null !== $fraction && is_numeric($fraction)) {
        $string .= $decimal;
        $words  = [];
        foreach (str_split((string)$fraction) as $number) {
            $words[] = $dictionary[$number];
        }
        $string .= implode(' ', $words);
    }

    return $string;
}

function getEngNumberInWordsDict()
{
    return [
        0                   => 'zero',
        1                   => 'one',
        2                   => 'two',
        3                   => 'three',
        4                   => 'four',
        5                   => 'five',
        6                   => 'six',
        7                   => 'seven',
        8                   => 'eight',
        9                   => 'nine',
        10                  => 'ten',
        11                  => 'eleven',
        12                  => 'twelve',
        13                  => 'thirteen',
        14                  => 'fourteen',
        15                  => 'fifteen',
        16                  => 'sixteen',
        17                  => 'seventeen',
        18                  => 'eighteen',
        19                  => 'nineteen',
        20                  => 'twenty',
        30                  => 'thirty',
        40                  => 'fourty',
        50                  => 'fifty',
        60                  => 'sixty',
        70                  => 'seventy',
        80                  => 'eighty',
        90                  => 'ninety',
        100                 => 'hundred',
        1000                => 'thousand',
        1000000             => 'million',
        1000000000          => 'billion',
        1000000000000       => 'trillion',
        1000000000000000    => 'quadrillion',
        1000000000000000000 => 'quintillion'
    ];
}

function getUrduNumberInWordsDict()
{
    $dictionary = [
        0            => 'صفر',
        1            => 'ایک',
        2            => 'دو',
        3            => 'تین',
        4            => 'چار',
        5            => 'پانچ',
        6            => 'چھ',
        7            => 'سات',
        8            => 'آٹھ',
        9            => 'نو',
        10           => 'دس',
        11           => 'گیارہ',
        12           => 'بارہ',
        13           => 'تیرہ',
        14           => 'چودہ',
        15           => 'پندرہ',
        16           => 'سولہ',
        17           => 'سترہ',
        18           => 'اٹھارہ',
        19           => 'انیس',
        20           => 'بیس',
        21           => 'اکیس',
        22           => 'بائیس',
        23           => 'تئیس',
        24           => 'چوبیس',
        25           => 'پچیس',
        26           => 'چھببیس',
        27           => 'ستائیس',
        28           => 'اٹھائیس',
        29           => 'انتیس',
        30           => 'تیس',
        31           => 'اکتیس',
        32           => 'بتیس',
        33           => 'تینتیس',
        34           => 'چونتیس',
        35           => 'پینتیس',
        36           => 'چھتیس',
        37           => 'سینتیس',
        38           => 'اڑتیس',
        39           => 'انتالیس',
        40           => 'چالیس',
        41           => 'اکتالیس',
        42           => 'بیالیس',
        43           => 'تینتالیس',
        44           => 'چوالیس',
        45           => 'پینتالیس',
        46           => 'چھیالیس',
        47           => 'سینتالیس',
        48           => 'اڑتالیس',
        49           => 'انچاس',
        50           => 'پچاس',
        51           => 'اکیاون',
        52           => 'باون',
        53           => 'ترپن',
        54           => 'چون',
        55           => 'پچپن',
        56           => 'چھپن',
        57           => 'ستاون',
        58           => 'اٹھاون',
        59           => 'انسٹھ',
        60           => 'ساٹھ',
        61           => 'اکسٹھ',
        62           => 'باسٹھ',
        63           => 'ترسٹھ',
        64           => 'چوسٹھ',
        65           => 'پینسٹھ',
        66           => 'چھیاسٹھ',
        67           => 'سڑسٹھ',
        68           => 'اٹھسٹھ',
        69           => 'انہتر',
        70           => 'ستر',
        71           => 'اکہتر',
        72           => 'بہتر',
        73           => 'تہتر',
        74           => 'چوہتر',
        75           => 'پچہتر',
        76           => 'چھہتر',
        77           => 'ستتر',
        78           => 'اٹھہتر',
        79           => 'اناسی',
        80           => 'اسی',
        81           => 'اکیاسی',
        82           => 'بیاسی',
        83           => 'تراسی',
        84           => 'چوراسی',
        85           => 'پچاسی',
        86           => 'چھیاسی',
        87           => 'ستاسی',
        88           => 'اٹھاسی',
        89           => 'نواسی',
        90           => 'نوے',
        91           => 'اکانوے',
        92           => 'بانوے',
        93           => 'ترانوے',
        94           => 'چورانوے',
        95           => 'پچانوے',
        96           => 'چھیانوے',
        97           => 'ستانوے',
        98           => 'اٹھانوے',
        99           => 'ننانوے',
        100          => 'سو',
        1000         => 'ہزار',
        100000       => 'لاکھ',
        // 1000000             => 'ملین',
        10000000     => ' کروڑ',
        1000000000   => ' ارب',
        100000000000 => ' کھرب',
    ];

    return $dictionary;
}

function convert_number_to_urdu_words($number)
{
    $hyphen      = '-';
    $conjunction = ' ';
    $separator   = ' ';
    $negative    = 'منفی ';
    $decimal     = ' اشاریہ ';
    $dictionary  = getUrduNumberInWordsDict();
    if (! is_numeric($number)) {
        return false;
    }
    if (($number >= 0 && (int)$number < 0) || (int)$number < 0 - PHP_INT_MAX) {
        // overflow
        trigger_error(
            'convert_number_to_words only accepts numbers between -' . PHP_INT_MAX . ' and ' . PHP_INT_MAX,
            E_USER_WARNING
        );

        return false;
    }
    if ($number < 0) {
        return $negative . convert_number_to_urdu_words(abs($number));
    }
    $string = $fraction = null;
    if (strpos($number, '.') !== false) {
        [$number, $fraction] = explode('.', $number);
    }
    switch (true) {
        case $number <= 100:
            $string = $dictionary[$number];
            break;
        case $number < 1000:
            $hundreds  = $number / 100;
            $remainder = $number % 100;
            $string    = $dictionary[$hundreds] . ' ' . $dictionary[100];
            if ($remainder) {
                $string .= $conjunction . convert_number_to_urdu_words($remainder);
            }
            break;
        case $number < 100000:
            $hundreds  = (int)($number / 1000);
            $remainder = $number % 1000;
            $string    = $dictionary[$hundreds] . ' ' . $dictionary[1000];
            if ($remainder) {
                $string .= $conjunction . convert_number_to_urdu_words($remainder);
            }
            break;
        case $number < 10000000:
            $hundreds  = (int)($number / 100000);
            $remainder = $number % 100000;
            $string    = $dictionary[$hundreds] . ' ' . $dictionary[100000];
            if ($remainder) {
                $string .= $conjunction . convert_number_to_urdu_words($remainder);
            }
            break;
        case $number < 1000000000:
            $hundreds  = (int)($number / 10000000);
            $remainder = $number % 10000000;
            $string    = $dictionary[$hundreds] . ' ' . $dictionary[10000000];
            if ($remainder) {
                $string .= $conjunction . convert_number_to_urdu_words($remainder);
            }
            break;
        case $number < 100000000000:
            $hundreds  = (int)($number / 1000000000);
            $remainder = $number % 1000000000;
            $string    = $dictionary[$hundreds] . ' ' . $dictionary[1000000000];
            if ($remainder) {
                $string .= $conjunction . convert_number_to_urdu_words($remainder);
            }
            break;
        case $number < 10000000000000:
            $hundreds  = (int)($number / 100000000000);
            $remainder = $number % 100000000000;
            $string    = $dictionary[$hundreds] . ' ' . $dictionary[100000000000];
            if ($remainder) {
                $string .= $conjunction . convert_number_to_urdu_words($remainder);
            }
            break;
        default:
            $baseUnit     = pow(1000, floor(log($number, 1000)));
            $numBaseUnits = (int)($number / $baseUnit);
            $remainder    = $number % $baseUnit;
            $string       = convert_number_to_urdu_words($numBaseUnits) . ' ' . $dictionary[$baseUnit];
            if ($remainder) {
                $string .= $remainder < 100 ? $conjunction : $separator;
                $string .= convert_number_to_urdu_words($remainder);
            }
            break;
    }
    if (null !== $fraction && is_numeric($fraction)) {
        $string .= $decimal;
        $words  = [];
        foreach (str_split((string)$fraction) as $number) {
            $words[] = $dictionary[$number];
        }
        $string .= implode(' ', $words);
    }

    return $string;
}

function getValidatePreviousBalance(int $previousBalanceFlag, int $party_id, int $setting_party_id)
{
    if ($previousBalanceFlag == 1) {
        if ($party_id == $setting_party_id) {
            return false;
        }

        return true;
    }

    return false;
}

function logQueryError(QueryException $exception)
{
    $query    = $exception->getSql();
    $bindings = $exception->getBindings();
    $message  = $exception->getMessage();
    Log::channel('querylog')->error("Query Error: $message, SQL: $query, Bindings: " . implode(", ", $bindings));
}

function handleTransactionButtonArray($voucherType = "", $voucherTitle = "", $voucherPosition = "")
{
    $buttons = [
        [
            'id'        => 'resetButton',
            'class'     => 'btn btn-outline-warning focus:border-2 btnReset',
            'title'     => 'Reset F5',
            'iconClass' => 'fas fa-sync-alt',
        ],
        [
            'id'        => 'saveButton',
            'class'     => 'btn btn-outline-success focus:border-2 btnSave',
            'title'     => 'Save F10',
            'iconClass' => 'fa fa-save',
        ],
    ];

    return $buttons;
}

function handleTransactionListTableHeaderTh($voucherType)
{
    $buttons = [];
    if ($voucherType === "purchases") {
        $buttons = [
            ['content' => '#', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Vr #', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Date', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Supplier', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Discount %', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Expense %', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Further Tax %', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Net Amount', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Action', 'class' => 'py-2 px-2 text-md']
        ];
    }
    if ($voucherType === "pendingInspection") {
        $buttons = [
            ['content' => '#', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Vr #', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Date', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Supplier', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Inward #', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Inward Date', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Call', 'class' => 'py-2 px-2 text-md']
        ];
    }
    if ($voucherType === "pendingInward") {
        $buttons = [
            [
                'content' => '#',
                'class'   => 'py-2 px-2 text-md'
            ],
            ['content' => 'Vr #', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Date', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Supplier', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'PO #', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'PO Date', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Call', 'class' => 'py-2 px-2 text-md']
        ];
    }
    if ($voucherType === "pendingPurchaseOrder") {
        $buttons = [
            [
                'content' => '#',
                'class'   => 'py-2 px-2 text-md'
            ],
            ['content' => 'Vr #', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Date', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Supplier', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Item', 'class' => 'py-2 px-2 text-md text-left'],
            ['content' => 'Qty', 'class' => 'py-2 px-2 text-md text-right'],
            ['content' => 'Wight', 'class' => 'py-2 px-2 text-md text-right'],
            ['content' => 'Rate', 'class' => 'py-2 px-2 text-md text-right'],
            ['content' => 'Call', 'class' => 'py-2 px-2 text-md text-right']
        ];
    }
    if ($voucherType === "pendingChequeInHand") {
        $buttons = [
            ['content' => '#', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Ch List #', 'class' => 'py-2 px-2 text-md text-nowrap'],
            ['content' => 'Ch #', 'class' => 'py-2 px-2 text-md '],
            ['content' => 'Ch Date', 'class' => 'py-2 px-2 text-md text-nowrap'],
            ['content' => 'Account', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Cheque In Hand', 'class' => 'py-2 px-2 text-md'],
            ['content' => 'Amount', 'class' => 'py-2 px-2 text-md text-nowrap'],
            ['content' => 'Cleared Amount', 'class' => 'py-2 px-2 text-md text-nowrap'],
            ['content' => 'Pending Amount', 'class' => 'py-2 px-2 text-md text-nowrap'],
            ['content' => 'Call', 'class' => 'py-2 px-2 text-md text-right']
        ];
    }

    return $buttons;
}

/**
 * Function validateValue
 *
 * @param mixed $value
 *
 * @return bool
 */
function validateValue(mixed $value): bool
{
    if ($value === null || $value === '' || $value === 0 || $value === '0' || $value === false || $value === [] || strtolower($value) === 'null' || strtolower($value) === 'undefined') {
        return false;
    }

    return true;
}

/**
 * Function getUserPermissions
 *
 * @return mixed
 */
function getUserPermissions()
{
    $userPermissions = User::getRoleGroupUserPermissions(Auth::user()->id);
    $desc            = $userPermissions->desc;
    $desc            = json_decode($desc);

    return getObjectToArray($desc);
}
