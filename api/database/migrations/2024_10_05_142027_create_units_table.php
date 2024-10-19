<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        DB::table('units')->insert(['id' => 1, 'name' => 'Pcs']);
        DB::table('units')->insert(['id' => 2, 'name' => 'Pcs/n']);
        DB::table('units')->insert(['id' => 3, 'name' => 'Pkt']);
        DB::table('units')->insert(['id' => 4, 'name' => 'Pkt/n']);
        DB::table('units')->insert(['id' => 5, 'name' => 'Sqr']);
        DB::table('units')->insert(['id' => 6, 'name' => 'Sqr/n']);
        DB::table('units')->insert(['id' => 7, 'name' => 'Set']);
        DB::table('units')->insert(['id' => 8, 'name' => 'Set/n']);
        DB::table('units')->insert(['id' => 9, 'name' => 'Mtr']);
        DB::table('units')->insert(['id' => 10, 'name' => 'Mtr/n']);
        DB::table('units')->insert(['id' => 11, 'name' => 'Bot./n']);
        DB::table('units')->insert(['id' => 12, 'name' => 'Kg/n']);
        DB::table('units')->insert(['id' => 13, 'name' => 'Bag/n']);
        DB::table('units')->insert(['id' => 14, 'name' => 'Can/n']);
        DB::table('units')->insert(['id' => 15, 'name' => 'Ml/T']);
        DB::table('units')->insert(['id' => 16, 'name' => 'Side To']);
        DB::table('units')->insert(['id' => 17, 'name' => 'Jar/n']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
