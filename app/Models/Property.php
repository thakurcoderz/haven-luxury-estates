<?php

namespace App\Models;

use Database\Factories\PropertyFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $property_type_id
 * @property int|null $user_id
 * @property string $title
 * @property string $slug
 * @property string $description
 * @property float $price
 * @property string $price_type
 * @property string|null $rent_period
 * @property string $status
 * @property bool $featured
 * @property int $bedrooms
 * @property float $bathrooms
 * @property int $area_sqft
 * @property int $garages
 * @property int|null $year_built
 * @property string $address
 * @property string $city
 * @property string|null $state
 * @property string|null $zip_code
 * @property string $country
 * @property float|null $latitude
 * @property float|null $longitude
 * @property array<string>|null $amenities
 * @property array<string>|null $images
 * @property string|null $video_url
 * @property string|null $floor_plan_url
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'property_type_id',
    'user_id',
    'title',
    'slug',
    'description',
    'price',
    'price_type',
    'rent_period',
    'status',
    'featured',
    'bedrooms',
    'bathrooms',
    'area_sqft',
    'garages',
    'year_built',
    'address',
    'city',
    'state',
    'zip_code',
    'country',
    'latitude',
    'longitude',
    'amenities',
    'images',
    'video_url',
    'floor_plan_url',
])]
class Property extends Model
{
    /** @use HasFactory<PropertyFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'featured' => 'boolean',
            'bedrooms' => 'integer',
            'bathrooms' => 'float',
            'area_sqft' => 'integer',
            'garages' => 'integer',
            'year_built' => 'integer',
            'latitude' => 'float',
            'longitude' => 'float',
            'amenities' => 'array',
            'images' => 'array',
        ];
    }

    /**
     * @return BelongsTo<PropertyType, $this>
     */
    public function propertyType(): BelongsTo
    {
        return $this->belongsTo(PropertyType::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<Enquiry, $this>
     */
    public function enquiries(): HasMany
    {
        return $this->hasMany(Enquiry::class);
    }

    /**
     * @return HasMany<SavedProperty, $this>
     */
    public function savedProperties(): HasMany
    {
        return $this->hasMany(SavedProperty::class);
    }

    /**
     * @param  Builder<Property>  $query
     */
    public function scopeAvailable(Builder $query): void
    {
        $query->where('status', 'available');
    }

    /**
     * @param  Builder<Property>  $query
     */
    public function scopeFeatured(Builder $query): void
    {
        $query->where('featured', true);
    }

    /**
     * @param  Builder<Property>  $query
     * @param  array<string, mixed>  $filters
     */
    public function scopeFilter(Builder $query, array $filters): void
    {
        $query->when($filters['search'] ?? null, function (Builder $query, string $search) {
            $query->where(function (Builder $query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('zip_code', 'like', "%{$search}%");
            });
        })->when($filters['type'] ?? null, function (Builder $query, string $type) {
            $query->whereHas('propertyType', function (Builder $query) use ($type) {
                $query->where('slug', $type);
            });
        })->when($filters['price_type'] ?? null, function (Builder $query, string $priceType) {
            if ($priceType !== 'all') {
                $query->where('price_type', $priceType);
            }
        })->when($filters['min_price'] ?? null, function (Builder $query, $minPrice) {
            $query->where('price', '>=', (float) $minPrice);
        })->when($filters['max_price'] ?? null, function (Builder $query, $maxPrice) {
            $query->where('price', '<=', (float) $maxPrice);
        })->when($filters['bedrooms'] ?? null, function (Builder $query, $bedrooms) {
            if ($bedrooms !== 'all') {
                $query->where('bedrooms', '>=', (int) $bedrooms);
            }
        })->when($filters['bathrooms'] ?? null, function (Builder $query, $bathrooms) {
            if ($bathrooms !== 'all') {
                $query->where('bathrooms', '>=', (float) $bathrooms);
            }
        })->when($filters['city'] ?? null, function (Builder $query, string $city) {
            if ($city !== 'all') {
                $query->where('city', $city);
            }
        })->when($filters['status'] ?? null, function (Builder $query, string $status) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        });
    }

    public function isSavedBy(?User $user): bool
    {
        if (! $user) {
            return false;
        }

        return $this->savedProperties()->where('user_id', $user->id)->exists();
    }
}
