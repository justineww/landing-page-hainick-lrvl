<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('creators_photocard_statistics', function (Blueprint $table) {
            $table->id();
            $table->string('creators')->nullable();
            $table->string('brand')->nullable();
            $table->string('projects')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('creators_photocard_statistics');
    }
};
