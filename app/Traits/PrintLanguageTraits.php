<?php
namespace App\Traits;

use App\Models\PrintLanguageKeyword;
use Illuminate\Support\Facades\Log;

trait PrintLanguageTraits
{
    use FunctionsTrait;

    /**
     * List of translations
     *
     * @var array
     */
    public array $language = [];
    /**
     * List of loaded language files
     *
     * @var array
     */
    public array $is_loaded = [];

    /**
     * Class constructor
     *
     * Initializes the language class and logs the initialization.
     *
     * @return void
     */
    public function __construct()
    {
        if (config('app.debug')) {
            Log::log('info', 'Language Class Initialized');
        }
    }

    /**
     * Function loadAsArray
     *
     * @param array  $lang_array
     * @param string $idiom
     * @param bool   $return
     *
     * @return array|bool
     */
    public function loadAsArray(array $lang_array, string $idiom = '', bool $return = false)
    {
        if (empty($lang_array)) {
            Log::log('error', 'Language data passed in incorrect format.');

            return $return ? [] : false;
        }
        if (empty($idiom) or ! preg_match('/^[a-z_-]+$/i', $idiom)) {
            $config = config();
            $idiom  = empty($config['locale']) ? 'english' : $config['locale'];
        }
        if ($return === false && isset($this->is_loaded['array']) && $this->is_loaded['array'] === $idiom) {
            return false;
        }
        if ($return === true) {
            return $lang_array;
        }
        $this->is_loaded['array'] = $idiom;
        $this->language           = array_merge((array)$this->language, $lang_array);

        return true;
    }

    /**
     * Function line
     *
     * @param string $line
     * @param bool   $logErrors
     *
     * @return string
     */
    public function line(string $line, bool $logErrors = false): string
    {
        if (! empty($line) && ! isset($this->language[$line])) {
            if ($logErrors && config('app.debug')) {
                Log::error('Could not find the language line: "' . $line . '"');
            }
            if (config('app.insertPrintLanguageKeywords') && env('INSERT_PRINT_LANGUAGE_KEYWORDS')) {
                $printLanguageKeyword = new PrintLanguageKeyword();
                $camelCaseKey         = $this->convertToCamelCase($line);
                $readableKey          = $this->convertUnderscoreToReadable($camelCaseKey);
                $readableKey          = $this->convertCamelCaseToReadable($readableKey);
                $checkIfKeywordExists = $printLanguageKeyword->where('key_name', $camelCaseKey)->first();
                if ($checkIfKeywordExists) {
                    return $checkIfKeywordExists->key_value;
                }
                $printLanguageKeyword->key_name  = $camelCaseKey;
                $printLanguageKeyword->key_value = $readableKey;
                $printLanguageKeyword->language  = 1;
                $printLanguageKeyword->save();
            }

            return $this->language[$line] ?? $line;
        }

        return $this->language[$line] ?? $line;
    }
}
