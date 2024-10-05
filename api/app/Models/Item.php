<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Item extends Model
{
    use HasFactory;

    protected $fillable = ["name", "description", "price", "unit_id"];

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }
}
