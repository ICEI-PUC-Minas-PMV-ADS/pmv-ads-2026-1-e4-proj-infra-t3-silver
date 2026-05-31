@extends('layouts.app')

  @section('content')
  <div class="mt-5">
      <div class="container-md">
          @if(session('status'))
              <div class="alert alert-success">
                  {{ session('status') }}
              </div>
          @endif

          <!-- Formulário de Criação/Edição -->
          @if($action == 'create' || $details)
              <div class="card mt-4 shadow-sm">
                  <div class="card-header">
                      {{ $action == 'create' ? 'Nova Categoria' : 'Editar Categoria' }}
                      @if($action == 'create')
                          <a href="{{ url('/categories') }}" class="btn btn-secondary float-end mt-2">Voltar</a>
                      @else
                          <a href="{{ url('/categories') }}" class="btn btn-secondary float-end mt-2">Cancelar</a>
                      @endif
                  </div>
                  <div class="card-body">
                      @if($details)
                          @php $category = $details['data']
                          <p class="mb-4">ID: {{ $category['id'] }} | Tipo: {{ $category['type'] }}</p>
                      @endif

                      <form method="POST" action="{{ $action == 'create' ? '/categories' : '/categories/' . $details['id'] }}">
                          @csrf
                          {{ $action == 'edit' ? method('PATCH') : method('POST') }}

                          <div class="row g-3">
                              <div class="col-md-6">
                                  <label class="form-label">Nome</label>
                                  <input type="text" class="form-control @error('name') is-invalid @enderror" 
                                      name="name" value="{{ $details ? $details['data']['name'] : '' }}">
                                  @error('name')
                                      <span class="span>
                                  @enderror
                              </div>

                              <div class="col-md-6">
                                  <labellabel>
                                  <select class="form-control @error('type') is-invalid @enderror" name="type">
                                      <option value="receita" @if(!isset($details) || $details['data']['type'] == 'receita') echo 'selected'
  @endif>Receitaoption>
                                      <option value="despesa" @if(!isset($details) || $details['data']['type'] == 'despesa') echo 'selected'
  @endif>Despesa</option>
                                  </select>
                                  @error('type')
                                      <span class="invalid-feedback">{{ $message }}</span>
                                  @enderror
                              </div>
                          </div>

                          <div class="d-grid gap-2button type="submit" class="btn btn-primary">
                                  {{ $action == 'create' ? 'Salvar' : 'Atualizar' }}
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          @endif

          <!-- Lista de Categorias -->
          <div class="mt-5">
              <div class="card">
                  <div class="card-header">
                      Categorh2 class="badge bg-info rounded-pill float-endh2>
                  </div>
                  <div class="card-body">
                      @if(empty($categories))
                          <p class="text-muted">Nenhuma categoria cadastrada ainda.</p>
                      @else
                          <div class="table-responsive">
                              <table class="thead>
                                      <tr>
                                          <th>ID</th>
                                          <th>Nome</th>
                                          <th>Tipo</th>
                                          <th>Ações</th>
  tr>
                                  </thead>
                                  <tbody>
                                      @foreach($categories as $category)
  td>
                                          <td>{{ $category['name'] }}</td>
                                          <td>{{ $category['typetd>
                                              <a href="{{ url('/categories/edit/' . $category['id']) }}" class="btn btna>
                                              <form method="POST" action="{{ url('/categories/' . $category['id']) }}" style="display:inline;">
                                                  @csrf
                                                  {{ method('DELETE') }}
                                                  <button type="submit" class="btn btn-sm btn-danger delete-item" 
                                                      onclick="return confirm('Excluir {{ $category['name'] }}?')">Deletartd>
                                      </tr>
                                      @endforeach
                                  </tbody>
                              </table>
                          </divdiv>
              </div>
          </div>
      </div>
  </div>

  @endsection

  <!-- Propriedades da View -->
  <?php 
  // Simulação de dados em memória (não persiste entre sessões)
  $categories = $_SESSION['categories'] ?? [];

  // Parâmetros da URL
  $action = $_GET['action'] ?? 'index';

  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      if ($_POST['_method'] === 'DELETE') {
          $id = $_GET['id'];
          unset($_SESSION['categories'][$id]);
          session()->flash('status', 'Categoria excluída com sucesso!');
          header("Location: /categories");
          exit;
      }
      elseif ($_POST['_method'] === 'PATCH') {
          $id = $_GET['id'];
          $data = $_POST;
          $_SESSION['categories'][$id] = [
              'id' => $id,
              'name' => $data['name'],
              'type' => $data['type']
          ];
          session()->flash('status', 'Categoria atualizada com sucesso!');
          header("Location: /categories");
          exit;
      }
      elseif ($_POST['_method'] === 'POST') {
          $name = htmlspecialchars($_POST['name'] ?? '');
          $type = $_POST['type'] ?? '';
          $id = count($_SESSION['categories']) ? max(array_keys($_SESSION['categories'])) + 1 : 1;

          session()->flash('status', 'Categoria criada com sucesso!');
          $idNoArray = $id;
          
          $_SESSION['categories'][$id] = [
              'id' => $id,
              'name' => $name,
              'type' => $type
          ];

          header("Location: /categories");
          exit;
      }
  }

  // Carrega dados para edição
  $details = $id = '';
  if ($_GET['action'] == 'edit') {
      $id = $_GET['id'];
      if (isset($_SESSION['categories'][$id])) {
          $details = [
              'id' => $id,
              'data' => $_SESSION['categories'][$id]
          ];
      } else {
          session()->flash('status', 'Categoria não encontrada.');
          header("Location: /categories");
          exit;
      }
  }

  // Passa variáveis para a view
  $attributes = [
      'categories' => $categories,
      'action' => $action,
      'details' => $details
  ];
  ?>
