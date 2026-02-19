<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'properties';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_user',
        'type',
        'rent_or_sale',
        'price',
        'state',
        'municipality',
        'exact_address',
        'space',
        'number_rooms',
        'floor',
        'description',
        'features',
        'photo1', // principal image
        'photo2', // secondary image
        'photo3', // secondary image
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'features' => 'array', // Cast features JSON to an array
    ];

    /**
     * Define the relationship with the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
