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

        DB::table('units')->insert(['name' => 'Pcs']);
        DB::table('units')->insert(['name' => 'Pcs/n']);
        DB::table('units')->insert(['name' => 'Pkt']);
        DB::table('units')->insert(['name' => 'Pkt/n']);
        DB::table('units')->insert(['name' => 'Sqr']);
        DB::table('units')->insert(['name' => 'Sqr/n']);
        DB::table('units')->insert(['name' => 'Set']);
        DB::table('units')->insert(['name' => 'Set/n']);
        DB::table('units')->insert(['name' => 'Mtr']);
        DB::table('units')->insert(['name' => 'Mtr/n']);
        DB::table('units')->insert(['name' => 'Bot./n']);
        DB::table('units')->insert(['name' => 'Kg/n']);
        DB::table('units')->insert(['name' => 'Bag/n']);
        DB::table('units')->insert(['name' => 'Can/n']);
        DB::table('units')->insert(['name' => 'Ml/T']);
        DB::table('units')->insert(['name' => 'Side To']);
        DB::table('units')->insert(['name' => 'Jar/n']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
