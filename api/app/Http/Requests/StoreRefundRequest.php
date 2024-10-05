<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRefundRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'date' => 'required|string',
            'discount' => 'required|numeric',
            'description' => 'present|string|nullable',

            'refund_items' => 'array|required|min:1',
            'refund_items.*.item_id' => 'required|exists:items,id',
            'refund_items.*.price' => 'required|numeric',
            'refund_items.*.quantity' => 'required|numeric',
            'refund_items.*.discount' => 'required|numeric',
        ];
    }
}
