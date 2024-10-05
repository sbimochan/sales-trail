<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\ItemController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('/v1')->group(
    function () {
        Route::controller(UnitController::class)->group(function () {
            Route::get('/units', 'index');
            Route::post('/units', 'store');
            Route::get('/units/{unit}', 'show');
            Route::put('/units/{unit}', 'update');
            Route::delete('/units/{unit}', 'destroy');
        });

        Route::controller(ItemController::class)->group(function () {
            Route::get('/items', 'index');
            Route::post('/items', 'store');
            Route::get('/items/{item}', 'show');
            Route::put('/items/{item}', 'update');
            Route::delete('/items/{item}', 'destroy');
        });
    }
);
