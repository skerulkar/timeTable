import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Professor } from '../../shared/professor';
import { CrudService } from '../../shared/crud.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-prof-details',
  templateUrl: './prof-details.component.html',
  styleUrls: ['./prof-details.component.css']
})
export class ProfDetailsComponent implements OnInit {
  profForm = this.fb.group({
    name: ['',[Validators.required, Validators.minLength(2)]],
    subject: ['',[Validators.required, Validators.minLength(2)]],
  });
  
  p: number = 1;
  Professor : Professor[] = [];
  hideWhenNoProfessor: boolean = false;
  noData: boolean = false;
  preLoader: boolean = true;

  constructor(private fb: FormBuilder,private crudService: CrudService,private toastr: ToastrService) { }

  ngOnInit(): void {
    // this.profFormLoad()
    this.dataState();
    this.GetProfList();
  }

  //Create basic Form
  profFormLoad() {
    this.profForm = this.fb.group({
      name: ['',[Validators.required, Validators.minLength(2)]],
      subject: ['',[Validators.required, Validators.minLength(2)]],
    });
  }

  get name() {
    return this.profForm.get('name');
  }

  get subject() {
    return this.profForm.get('subject');
  } 


  dataState () {
    this.crudService.GetProfessorList().valueChanges().subscribe(data => {
      this.preLoader = false;
      if(data.length <= 0){
        this.hideWhenNoProfessor = false;
        this.noData = true;
      } else {
        this.hideWhenNoProfessor = true;
        this.noData = false;
      }
    })
  }
  ResetForm() {
    this.profForm.reset();
  } 

  GetProfList() {
    let s = this.crudService.GetProfessorList();
    s.snapshotChanges().subscribe(data => {
      this.Professor = [];
      data.forEach(item => {
        let a:any = item.payload.toJSON(); 
        a['$key'] = item.key;
        this.Professor.push(a as Professor);
      })
    })
  }

  addProf(prof:any) {
    this.crudService.AddProf(prof.value);
    this.toastr.success(this.profForm.controls['name'].value + ' successfully added!');
    this.ResetForm();
  }
  
  onDeleteRow(prof:any): void {
    if (window.confirm('Are sure you want to delete this Professor ?')) {
      this.crudService.DeleteProfessor(prof.$key);
      this.toastr.success(prof.name + ' successfully Deleted!');
    }
  }
}