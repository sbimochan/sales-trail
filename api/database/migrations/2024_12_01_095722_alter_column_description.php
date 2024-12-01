<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('refunds', function (Blueprint $table) {
            $table->renameColumn('description', 'title');
            $table->text('description')->nullable();
        });

        Schema::table('sales', function (Blueprint $table) {
            $table->renameColumn('description', 'title');
            $table->text('description')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('refunds', function (Blueprint $table) {
            $table->dropColumn('description');
            $table->renameColumn('title', 'description');
        });

        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn('description');
            $table->renameColumn('title', 'description');
        });
    }
};
