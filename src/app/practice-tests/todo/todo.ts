import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TodoServices, Todos } from '../../core/services/todo-services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo implements OnInit {
   todos = signal<Todos[]>([]);
  selectedTodo?: Todos;
  isEdit = false;
  showForm = false;
  showDetails = false;

  constructor(private service: TodoServices) { }

  ngOnInit() {
    this.loadTodos();
  }
  form = new FormGroup({
    title:  new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(5)]),
    isCompleted: new FormControl(false)
  });
  
  get f() {
    return this.form.controls;
  }
  
  
  loadTodos() {
    this.service.getTodos().subscribe({
      next: (data) => {
        this.todos.set(data)
      },
      error: (err) => {
        alert('Todo fetching failed');
      }
    });
  }

  openForm(todo?: Todos) {
    this.showForm = true;
    this.showDetails = false;
    this.isEdit = !!todo;
    this.form.reset({ title: '', description: '', isCompleted: false });

    if (todo) {
      this.selectedTodo = todo;
      this.form.patchValue(todo);
    }
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    const value = this.form.value as Todos;

    const successHandler = () => {
      this.loadTodos();
      alert(`Todo ${this.isEdit ? 'updated' : 'created'} successfully!`);
      this.closeModal()
    };

    const errorHandler = (err: any) => {
      this.closeModal();
      alert(`Operation failed. Please check the network.`);
      console.error(err);
    };

    if (this.isEdit && this.selectedTodo?.id) {
      this.service.update(this.selectedTodo.id, value).subscribe({
        next: successHandler,
        error: errorHandler
      });
    } else {
      this.service.create(value).subscribe({
        next: successHandler,
        error: errorHandler
      });
    }
  }

  viewDetails(todo: Todos) {
    this.selectedTodo = todo;
    this.showDetails = true;
    this.showForm = false;
  }

  deleteTodo(id?: number) {
    if (!id) return;
    this.service.delete(id).subscribe({
        next: () => {
          this.loadTodos();
          alert('Deleted!');
          this.closeModal();
        },
        error: (err) => {
            alert('Deletion failed!');
            console.error(err);
        }
    });
  }
  
  closeModal() {
    this.showForm = false;
    this.showDetails = false;
  }
}