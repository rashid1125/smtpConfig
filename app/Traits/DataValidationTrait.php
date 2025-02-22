<?php
/**
 * File DataValidationTrait
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

use App\Exceptions\UserAlertException;
use Illuminate\Support\Facades\Validator;

trait DataValidationTrait
{
    /**
     * Function validateData
     *
     * @param array|object $data
     * @param array|object $rules
     * @param array|object $messages
     *
     * @throws \App\Exceptions\UserAlertException
     */
    protected function validateData(array | object $data, array | object $rules, array | object $messages = []): void
    {
        if (empty($data) && empty($rules)) {
            throw new UserAlertException("Data and Rules must not be empty", 422);
        }
        if (! empty($data) && ! is_object($data)) {
            $data = (array)$data;
        }
        if (! empty($rules) && ! is_array($rules)) {
            $rules = (array)$rules;
        }
        $validator = Validator::make($data, $rules, $messages);
        if ($validator->fails()) {
            $errors       = $validator->errors()->all();
            $errorMessage = implode("<br />", $errors);
            throw new UserAlertException($errorMessage, 400);
        }
    }

    /**
     * Function validateInventoryType
     *
     * @param array|object $details
     * @param array|null   $rule
     *
     * @throws \App\Exceptions\UserAlertException
     * @return void
     */
    protected function validateInventoryType(array | object $details, array | null $rule = []): void
    {
        $rules = [
            'item_id'                 => 'required|exists:items,item_id',
            'warehouse_id'            => 'required|exists:departments,did',
            'stock_keeping_method_id' => 'required|exists:stock_keeping_methods,id',
            'qty'                     => 'required|numeric',
        ];
        foreach ($details as $detail) {
            if (array_key_exists('stock_keeping_method_id', $detail)) {
                $stockKeepingMethodId = (int)$detail['stock_keeping_method_id'];
                if ($stockKeepingMethodId === 1) {
                    $rules = [
                        'item_id'                 => 'required|exists:items,item_id',
                        'warehouse_id'            => 'required|exists:departments,did',
                        'stock_keeping_method_id' => 'required|exists:stock_keeping_methods,id',
                        'qty'                     => 'required|numeric',
                    ];
                } elseif ($stockKeepingMethodId === 2) {
                    $rules = [
                        'item_id'                 => 'required|exists:items,item_id',
                        'warehouse_id'            => 'required|exists:departments,did',
                        'stock_keeping_method_id' => 'required|exists:stock_keeping_methods,id',
                        'weight'                  => 'required|numeric',
                    ];
                } elseif ($stockKeepingMethodId === 3) {
                    $rules = [
                        'item_id'                 => 'required|exists:items,item_id',
                        'warehouse_id'            => 'required|exists:departments,did',
                        'stock_keeping_method_id' => 'required|exists:stock_keeping_methods,id',
                        'qty'                     => 'required|numeric',
                        'weight'                  => 'required|numeric',
                    ];
                }
                if (! empty($rule)) {
                    $rules = array_merge($rules, $rule);
                }
                $this->validateData($detail, $rules);
            }
        }
    }
}
