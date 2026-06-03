<?php

use App\Models\Account;
use App\Models\Budget;
use App\Models\Category;
use App\Models\Family;
use App\Models\Transaction;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->family = Family::create(['name' => 'Família Teste']);
    $this->user = User::factory()->create(['familyId' => $this->family->id]);
    Sanctum::actingAs($this->user);
});

test('RF03 - usuario pode ver sua familia', function () {
    $response = $this->getJson('/api/family');

    $response->assertOk()
        ->assertJsonFragment(['name' => 'Família Teste']);
});

test('RF03 - usuario pode atualizar nome da familia', function () {
    $response = $this->putJson('/api/family', [
        'name' => 'Família Renomeada',
    ]);

    $response->assertOk()
        ->assertJsonFragment(['name' => 'Família Renomeada']);
});

test('RF03 - usuario pode listar membros da familia', function () {
    $response = $this->getJson('/api/family/members');

    $response->assertOk();
    expect($response->json())->toHaveCount(1)
        ->and($response->json()[0]['email'])->toBe($this->user->email);
});

test('RF03 - usuario pode sair da familia', function () {
    $response = $this->postJson('/api/family/leave');

    $response->assertOk()
        ->assertJsonStructure(['message', 'family']);

    $this->user->refresh();
    expect($this->user->familyId)->not->toBe($this->family->id);
});

test('RF03 - usuario pode entrar em outra familia', function () {
    $outraFamilia = Family::create(['name' => 'Família Destino']);

    $response = $this->postJson('/api/family/join', [
        'family_id' => $outraFamilia->id,
    ]);

    $response->assertOk()
        ->assertJsonFragment(['message' => 'Joined family successfully and merged history.']);

    $this->user->refresh();
    expect($this->user->familyId)->toBe($outraFamilia->id);
});

test('RF03 - entrar na propria familia retorna erro', function () {
    $response = $this->postJson('/api/family/join', [
        'family_id' => $this->family->id,
    ]);

    $response->assertBadRequest();
});

test('RF03 - join migra contas para nova familia', function () {
    $conta = Account::create([
        'familyId' => $this->family->id, 'name' => 'Conta',
        'type' => 'checking', 'balance' => 100,
    ]);
    $outraFamilia = Family::create(['name' => 'Destino']);

    $this->postJson('/api/family/join', [
        'family_id' => $outraFamilia->id,
    ]);

    $conta->refresh();
    expect($conta->familyId)->toBe($outraFamilia->id);
});

test('RF03 - sair da familia limpa familia antiga se sozinho', function () {
    $this->postJson('/api/family/leave');

    $familiaAntiga = Family::find($this->family->id);
    expect($familiaAntiga)->toBeNull();
});

test('RF13 - sincronizacao retorna dados do usuario', function () {
    Account::create([
        'familyId' => $this->family->id, 'name' => 'CC',
        'type' => 'checking', 'balance' => 100,
    ]);
    Category::create([
        'familyId' => $this->family->id, 'userId' => $this->user->id,
        'name' => 'Teste', 'color' => '#000', 'icon' => 'x',
    ]);

    $response = $this->getJson('/api/accounts');
    $response->assertOk();

    $responseCat = $this->getJson('/api/categorias');
    $responseCat->assertOk();

    $responseTr = $this->getJson('/api/budgets');
    $responseTr->assertOk();

    $responseGoals = $this->getJson('/api/goals');
    $responseGoals->assertOk();
});
