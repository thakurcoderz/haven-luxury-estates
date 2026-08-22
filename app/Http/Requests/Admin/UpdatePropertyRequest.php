<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'property_type_id' => ['required', 'exists:property_types,id'],
            'user_id' => ['nullable', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'price_type' => ['required', 'string', 'in:sale,rent'],
            'rent_period' => ['nullable', 'string', 'in:monthly,yearly,weekly'],
            'status' => ['required', 'string', 'in:available,pending,sold,rented'],
            'featured' => ['boolean'],
            'bedrooms' => ['required', 'integer', 'min:0', 'max:50'],
            'bathrooms' => ['required', 'numeric', 'min:0', 'max:50'],
            'area_sqft' => ['required', 'integer', 'min:0'],
            'garages' => ['nullable', 'integer', 'min:0', 'max:50'],
            'year_built' => ['nullable', 'integer', 'min:1800', 'max:'.(date('Y') + 5)],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'zip_code' => ['nullable', 'string', 'max:50'],
            'country' => ['nullable', 'string', 'max:100'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['string', 'max:100'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string', 'url'],
            'video_url' => ['nullable', 'string', 'url'],
            'floor_plan_url' => ['nullable', 'string', 'url'],
        ];
    }
}
