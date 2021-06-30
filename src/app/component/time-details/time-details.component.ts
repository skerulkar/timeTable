import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/shared/crud.service';
import { TimeDetails } from 'src/app/shared/time-details';

@Component({
  selector: 'app-time-details',
  templateUrl: './time-details.component.html',
  styleUrls: ['./time-details.component.css']
})
export class TimeDetailsComponent implements OnInit {
  timeDetails:TimeDetails[] = [];
  hideWhenNoData: boolean = false;
  editclicked:boolean = false;
  preLoader: boolean = true;
  timeSlotForm = this.fb.group({
    $key:[''],
    startTime: ['',Validators.required],
    endTime: ['',Validators.required],
    slotDuration: ['',[Validators.required, Validators.pattern("^[0-9]*$")]],
    BreakFrom: ['',Validators.required],
    BreakTo: ['',Validators.required]
  });
  constructor(private fb: FormBuilder,private toastr: ToastrService, private crudService: CrudService) { }

  ngOnInit(): void {
    this.fetchSlotData();
  }

  get controls(){
    return this.timeSlotForm.controls;
  }

  ResetForm() {
    this.timeSlotForm.reset();
  }

  setTimeSlot(timeSlotForm:any) {
    this.crudService.AddTimeSlot(timeSlotForm);
    this.toastr.success('Time Slot successfully added!');
    this.editclicked=true;
    this.ResetForm();
  }

  fetchSlotData() {
    let data = this.crudService.GetTimeSlot();
    data.snapshotChanges().subscribe(data => {
      this.timeDetails = [];
      data.forEach(item => {
        let a:any = item.payload.toJSON();
        a['$key'] = item.key;
        this.timeDetails.push(a as TimeDetails);
        this.hideWhenNoData=true
      })
    })
  }

  dataState () {
    this.crudService.GetTimeSlot().valueChanges().subscribe(data => {
      this.preLoader = false;
      if(data.length <= 0){
        this.hideWhenNoData = false;
      } else {
        this.hideWhenNoData = true;
      }
    })
  }
  editSlot() {
    this.fetchSlotData();
    this.timeSlotForm.controls.$key.setValue(this.timeDetails[0].$key);
    this.timeSlotForm.controls.startTime.setValue(this.timeDetails[0].startTime);
    this.timeSlotForm.controls.endTime.setValue(this.timeDetails[0].endTime);
    this.timeSlotForm.controls.slotDuration.setValue(this.timeDetails[0].slotDuration);
    this.timeSlotForm.controls.BreakFrom.setValue(this.timeDetails[0].BreakFrom);
    this.timeSlotForm.controls.BreakTo.setValue(this.timeDetails[0].BreakTo);
    this.editclicked=true;
  }

  updateSlot(prof:any): void {
      this.crudService.updateSlot(prof);
      this.editclicked=false;
      this.toastr.success('Time Slot successfully updated!');
  }
  // deleteSlot(key:any) {
  //   this.crudService.delSlot(key);
  // }

}
