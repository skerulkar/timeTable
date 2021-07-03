import { Injectable } from '@angular/core';
import { Professor } from '../shared/professor';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { TimeDetails } from 'src/app/shared/time-details';

@Injectable({
  providedIn: 'root'
})

export class CrudService {
  professorsRef!: AngularFireList<any>;
  professorRef!: AngularFireObject<any>;
  timeSlotsRef!: AngularFireList<any>;
  timeSlotRef!: AngularFireObject<any>;
  
  constructor(private db: AngularFireDatabase) { }

  // Create Professor
  AddProf(professor: Professor) {
    console.log(professor);
    this.professorsRef = this.db.list('/professors-list');
    if (professor) {
      this.professorsRef.push({
        name: professor.name,
        subject: professor.subject,
      })
    }
  }

  // Add Start End time
  AddTimeSlot(timeSlot: TimeDetails) {
    this.timeSlotsRef = this.db.list('/time-data');
    if (timeSlot) {
      this.timeSlotsRef.push({
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
        slotDuration: timeSlot.slotDuration,
        BreakFrom: timeSlot.BreakFrom,
        BreakTo: timeSlot.BreakTo,
      })
    }
  }

  // Fetch timeslot
  GetTimeSlot() {
    this.timeSlotsRef = this.db.list('time-data');
    return this.timeSlotsRef;
  }

  // Fetch Professor List
  GetProfessorList() {
    this.professorsRef = this.db.list('professors-list');
    return this.professorsRef;
  }

  // Delete Professor Object
  DeleteProfessor(id: string) { 
    this.professorRef = this.db.object('professors-list/'+id);
    this.professorRef.remove();
  }

  updateSlot(timeSlot: TimeDetails) {
    if (timeSlot) {
      this.timeSlotsRef.set(timeSlot.$key, {
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
        slotDuration: timeSlot.slotDuration,
        BreakFrom: timeSlot.BreakFrom,
        BreakTo: timeSlot.BreakTo
      })
    }
  }

  delSlot() { 
    this.timeSlotsRef = this.db.list('time-data');
    this.timeSlotsRef.remove();
  }
  
}