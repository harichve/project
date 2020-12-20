import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent {
  data: any[];
  valid = false;
  suggestData: PeriodicElement[];
  listData: PeriodicElement[];
  suggestValid = false;
  sortOrder = 0;
  errorStatus=false;
  errorMsg: string;

  constructor(private http: HttpClient) { }

  ngOnChange() { }

  toggleSort() {
    this.sortOrder = 1 - this.sortOrder
    this.data.sort().reverse();
  }

  registrationForm = new FormGroup({
    name: new FormControl('', Validators.required)
  });
  onSubmit() {
    if (this.registrationForm.get('name').value.trim() !== "") {
      this.http.post("/api/index/addGridData", { "name": this.registrationForm.get('name').value, "sortOrder": this.sortOrder }).subscribe(result => {
        if (result['status'] === "insertion Sucessful") {
          this.errorStatus=false;
          this.data = result['data']
        } else {
          this.errorStatus=true;
          this.errorMsg = result["errorMsg"];
        }
      });
    }else{
      this.errorStatus=true;
      this.errorMsg = "Data cannot be empty.";
    }
  }

  showSuggesstion() {
    if (this.registrationForm.value['name'] !== "") {
      this.http.post<PeriodicElement[]>("/api/index/getGridData", this.registrationForm.value).subscribe(result => {
        this.listData = []
        this.suggestValid = true;
        this.suggestData = result;
      });
    } else {
      this.suggestData = [];
    }
  }

  onFocusOut() {
    this.suggestValid = false;
  }

  onFocus() {
    this.suggestValid = true;
  }

  ngOnInit(): void {
    this.http.get<PeriodicElement[]>("/api/index/getGridData").subscribe(result => {
      this.data = result;
    });
  }
}
export interface PeriodicElement {
  name: string;
}