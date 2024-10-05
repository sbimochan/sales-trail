<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = ["name"];

    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }

    public function delete()
    {
        if ($this->items()->exists()) {
            throw new Exception('This unit cannot be deleted because it is associated with items.');
        }

        return parent::delete();
    }
}
