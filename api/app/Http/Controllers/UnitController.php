<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaginationRequest;
use Exception;
use App\Models\Unit;
use App\Http\Requests\StoreUnitRequest;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(PaginationRequest $request)
    {
        $data = $request->validated();

        $q = $data['q'] ?? "";
        $page = $data['page'] ?? 1;
        $limit = $data['limit'] ?? 10;

        return Unit::where('name', 'like', "%$q%")->paginate($limit, ['*'], 'page', $page);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUnitRequest $request)
    {
        $data = $request->validated();

        $unit = Unit::create($data);

        return $unit;
    }

    /**
     * Display the specified resource.
     */
    public function show(Unit $unit)
    {
        return $unit;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreUnitRequest $request, Unit $unit)
    {
        $data = $request->validated();

        $unit->update($data);

        return $unit;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Unit $unit)
    {
        try {
            $unit->delete();
        } catch (Exception $error) {
            return response()->json(['message' => $error->getMessage()], 409);
        }

        return $unit;
    }
}
