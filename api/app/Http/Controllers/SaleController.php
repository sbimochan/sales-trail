<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreSaleRequest;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Sale::orderBy('created_at', 'desc')->paginate(10);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSaleRequest $request)
    {
        $data = $request->validated();

        $discount = $data['discount'];
        $sale_items = $data['sale_items'];
        $total = 0;

        DB::beginTransaction();

        try {
            $items = array_map(function ($item) use (&$total) {
                $item_total = ($item['quantity'] * $item['price']) - $item['discount'];
                $total += $item_total;

                return new SaleItem([
                    'price' => $item['price'],
                    'item_id' => $item['item_id'],
                    'quantity' => $item['quantity'],
                    'discount' => $item['discount'],
                    'total' => $item_total
                ]);
            }, $sale_items);

            $sale = Sale::create([
                'date' => $data['date'],
                'description' => $data['description'],
                'total' => $total,
                'discount' => $discount,
                'grand_total' => $total - $discount,
            ]);

            $sale->sale_items()->saveMany($items);
        } catch (Exception $error) {
            DB::rollBack();
            throw $error;
        }

        DB::commit();

        return Sale::find($sale->id);
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        return $sale;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreSaleRequest $request, Sale $sale)
    {
        $data = $request->validated();

        $discount = $data['discount'];
        $sale_items = $data['sale_items'];
        $total = 0;

        DB::beginTransaction();

        try {
            $sale->sale_items()->forceDelete();

            $items = array_map(function ($item) use (&$total) {
                $item_total = ($item['quantity'] * $item['price']) - $item['discount'];
                $total += $item_total;

                return new SaleItem([
                    'price' => $item['price'],
                    'item_id' => $item['item_id'],
                    'quantity' => $item['quantity'],
                    'discount' => $item['discount'],
                    'total' => $item_total
                ]);
            }, $sale_items);


            $sale->update([
                'date' => $data['date'],
                'description' => $data['description'],
                'total' => $total,
                'discount' => $discount,
                'grand_total' => $total - $discount,
            ]);

            $sale->sale_items()->saveMany($items);
        } catch (Exception $error) {
            DB::rollBack();
            throw $error;
        }

        DB::commit();

        return Sale::find($sale->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sale $sale)
    {
        $sale->delete();

        return $sale;
    }
}
