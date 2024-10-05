<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSaleRequest extends FormRequest
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

            'sale_items' => 'array|required|min:1',
            'sale_items.*.item_id' => 'required|exists:items,id',
            'sale_items.*.price' => 'required|numeric',
            'sale_items.*.quantity' => 'required|numeric',
            'sale_items.*.discount' => 'required|numeric',
        ];
    }
}
