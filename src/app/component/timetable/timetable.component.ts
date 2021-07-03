import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/shared/crud.service';
import { Professor } from 'src/app/shared/professor';
import { TimeDetails } from 'src/app/shared/time-details';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {
  weekdays: any = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  timeslots: any;
  timeArray: any = [];
  TeacherArr: any =[];
  oneDayArr: any = [];
  breakslot: any = [];
  professor: Professor[] = [];
  timeDetails: TimeDetails[] = [];
  allowedRepeatation:any = 2;
  errorShow: boolean = false;
  constructor(private crudService: CrudService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.fetchProfessorData();
    this.fetchSlotData();
    this.createTimeTable();
  }

  fetchProfessorData() {
    let data = this.crudService.GetProfessorList();
    data.snapshotChanges().subscribe(data => {
      data.forEach(item => {
        let a:any = item.payload.toJSON(); 
        a['$key'] = item.key;
        this.professor.push(a as Professor);
      })
    })
  }

  fetchSlotData() {
    let data = this.crudService.GetTimeSlot();
    data.snapshotChanges().subscribe(data => {
      this.timeDetails = [];
      data.forEach(item => {
        let a:any = item.payload.toJSON();
        a['$key'] = item.key;
        this.timeDetails.push(a as TimeDetails);
      })
      this.createTimeTable();
    })
    
  }

  createTimeTable () {
    if (this.timeDetails[0] && this.timeDetails[0].startTime) {
      var startTime = this.convertToMin(this.timeDetails[0].startTime);
      var endTime = this.convertToMin(this.timeDetails[0].endTime);
      var slotDuration = parseInt(this.timeDetails[0].slotDuration);
      var BreakFrom = this.convertToMin(this.timeDetails[0].BreakFrom);
      var BreakTo = this.convertToMin(this.timeDetails[0].BreakTo);
      var temp = startTime;
      for (let a=1; a < 50 ;  a++) {
        let temp1;
        if(temp <= endTime) {
          if (temp == BreakFrom) {
            temp1 = BreakTo;
          } else if (temp > BreakFrom && temp < BreakTo) {
            this.errorShow = true;
            break;
          } else {
            temp1 = temp + slotDuration;
          }
          let arrElements1 = Math.floor((temp / 60)) + ":" + ((temp % 60)!=0 ? temp % 60 : '00');
          let arrEmlement2 = Math.floor((temp1 / 60)) + ":" +((temp1 % 60)!=0 ? temp1 % 60 : '00');
          this.timeArray.push(arrElements1 + "-" + arrEmlement2);
          temp = temp1;
        } else{
          break;
        }
      }

      for (let day in this.weekdays) {
        this.oneDayArr = [];
        let professor = this.shuffle(this.professor);
        for (let k=0;k<this.timeArray.length;k++) {
          let teachername:any;
          teachername=professor[k];
          if (!teachername) {
            let currentIndex = professor.length,  randomIndex;
            randomIndex = Math.floor(Math.random() * currentIndex);
            teachername=professor[randomIndex];
          }
          var slotStart = this.timeArray[k].split("-")
          var slotStart1 = this.convertToMin(slotStart[0]);
          if (slotStart1 >= BreakFrom && slotStart1 < BreakTo){
            teachername={
              $key: "-1",
              name: "Break",
              subject: ""
            };
          }
          this.oneDayArr.push(teachername);
        }
        this.TeacherArr.push(this.oneDayArr);
      }
      console.log(this.TeacherArr);
    }
  }

  shuffle(array:any) {
    let currentIndex = array.length,  randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }
  checkDuplicateValue(teachername:any) {
    if (teachername && this.allowedRepeatation < this.oneDayArr.reduce((a:any, v:any) => (v == teachername.subject ? a + 1 : a), 0)) {
      this.checkDuplicateValue(teachername);
    } else {
      return teachername;
    }
  }
  convertToMin(time:any) {
    let data1 = time.split(":");
    return (Math.floor(data1[0] * 60) + Math.floor(data1[1]));
  }

  exportAsPDF() {
    const doc = new jsPDF();
    autoTable(doc, {html: '#timeTable'});
    doc.save("timeTable.pdf");
  }
}
