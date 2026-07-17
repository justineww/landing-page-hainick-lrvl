<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('official_talent_desc', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('talent_id');
            $table->string('image_url')->nullable();
            $table->string('nama')->nullable();
            $table->text('bio')->nullable();
            $table->unsignedBigInteger('followers_ig')->nullable();
            $table->unsignedBigInteger('followers_tiktok')->nullable();
            $table->unsignedBigInteger('followers_twitter')->nullable();
            $table->string('tinggi')->nullable();
            $table->string('berat')->nullable();
            $table->string('umur')->nullable();

            $table->foreign('talent_id')
                ->references('id')->on('official_talent')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('official_talent_desc');
    }
};
