<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InventoryValidatedRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules = [
            'itemId'               => 'required|integer',
            'stockKeepingMethodId' => 'required|integer',
            'departmentId'         => 'required|integer',
            'currentDate'          => 'required|date',
            'voucherType'          => 'required',
            'colorCodeId'          => 'nullable',
            'voucherId'            => 'nullable',
        ];

        switch ((int) $this->input('stockKeepingMethodId')) {
            case 1:
                $rules['qty']    = 'required|numeric';
                $rules['weight'] = 'nullable';
                break;
            case 2:
                $rules['qty']    = 'nullable';
                $rules['weight'] = 'required|numeric';
                break;
            case 3:
                $rules['qty']    = 'required|numeric';
                $rules['weight'] = 'required|numeric';
                break;
        }
        return $rules;
    }

    public function messages()
    {
        return [
            'itemId.required'               => 'The item ID is required.',
            'itemId.integer'                => 'The item ID must be an integer.',
            'stockKeepingMethodId.required' => 'The stock keeping method ID is required.',
            'stockKeepingMethodId.integer'  => 'The stock keeping method ID must be an integer.',
            'departmentId.required'         => 'The department ID is required.',
            'departmentId.integer'          => 'The department ID must be an integer.',
            'currentDate.required'          => 'The current date is required.',
            'currentDate.date'              => 'The current date must be a valid date.',
            'voucherType.required'          => 'The voucher type is required.',
            'qty.required'                  => 'The quantity is required when the stock keeping method is 1 or 3.',
            'qty.numeric'                   => 'The quantity must be a number.',
            'weight.required'               => 'The weight is required when the stock keeping method is 2 or 3.',
            'weight.numeric'                => 'The weight must be a number.',
        ];
    }
}
