import React, { Component } from 'react';
 import logo from '../Images/Logo.png'; 
 import '../mystyle.css'

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};

class Registration extends Component {
constructor() {
      super();
      this.state = {
        fields: {},
        errors: {}
      }

      this.handleChange = this.handleChange.bind(this);
      this.submituserRegistrationForm = this.submituserRegistrationForm.bind(this);

    };

    handleChange(e) {
      let fields = this.state.fields;
      fields[e.target.name] = e.target.value;
      this.setState({
        fields
      });

    }

    submituserRegistrationForm(e) {
      e.preventDefault();
      if (this.validateForm()) {
          let fields = {};
          alert("You have entered below details : "+"\r\n"
          	+this.state.fields.prefix+"\r\n"
          	+this.state.fields.fname+"\r\n"
          	+this.state.fields.lname+"\r\n"
          	+this.state.fields.phone+"\r\n"
          	+this.state.fields.addressstreet+"\r\n"
          	);

          fields["fname"] = "";
          fields["lname"] = "";
          fields["prefix"] = "Mr.";
          fields["mobileno"] = "";
          fields["adressroad"] = "";
          fields["adressstreet"] = "";
          fields["postcode"] = "";
          fields["city"] = "";
          fields["vbody"] = "";
          fields["capacity"] = "";
          this.setState({fields:fields});

      }

    }

    validateForm() {

      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;

      if (!fields["fname"]) {
        formIsValid = false;
        errors["fname"] ="*Please enter your First Name.";
      }
 
      if (typeof fields["fname"] !== "undefined") {
        if (!fields["fname"].match(/^[a-zA-Z ]*$/)) {
          formIsValid = false;
         errors["fname"] ="*Please enter alphabet characters only in your name.";
        }
      }
		/*
      if (!fields["lname"]) {
        formIsValid = false;
        errors["lname"] ="*Please enter your Last Name.";
      }
 
      if (typeof fields["lname"] !== "undefined") {
        if (!fields["lname"].match(/^[a-zA-Z ]*$/)) {
          formIsValid = false;
         errors["lname"] ="*Please enter alphabet characters only in your name.";
        }
      }

      if (!fields["emailid"]) {
        formIsValid = false;
        errors["emailid"] = "*Please enter your email-ID.";
      }

      if (typeof fields["emailid"] !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(fields["emailid"])) {
          formIsValid = false;
          errors["emailid"] = "*Please enter valid email-ID.";
        }
      }

      if (!fields["password"]) {
        formIsValid = false;
        errors["password"] = "*Please enter your password.";
      }

      if (typeof fields["password"] !== "undefined") {
        if (!fields["password"].match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
          formIsValid = false;
          errors["password"] = "*Please enter secure and strong password.";
        }
      }
      */

      if (!fields["mobileno"]) {
        formIsValid = false;
        errors["mobileno"] = "*Please enter valid mobile no.";
      }

      if (typeof fields["mobileno"] !== "undefined") {
        if (!fields["mobileno"].match(/^[0-9]{10}$/)) {
          formIsValid = false;
          errors["mobileno"] = "Please enter valid mobile no.";
        }
      }

     this.setState({
        fields: {prefix: fields["prefix"]}
      });

      this.setState({
        errors: errors
      });
      return formIsValid;


    }

  render() {
  	const {errors} = this.state;
    return (
 	<div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
	<form class = "form" method="post"  name="userRegistrationForm"  onSubmit= {this.submituserRegistrationForm} >
	<label  for="prefix">Prefix:</label>
    <select class="select2" name="prefix" id="prefix" value={this.state.fields.prefix} onChange={this.handleChange} >
	<option value="Mr">Mr.</option>
	<option value="Ms">Ms.</option>
	<option value="Mrs">Mrs.</option>
	<option value="Dr">Dr.</option>
	</select>

	<label  for="fname">First Name :</label>
	<input class="class_1"  type="text" name="fname" placeholder="Please enter your first name"  value={this.state.fields.fname} onChange={this.handleChange} />
	
	<label for="lname">Last Name :</label>
	<input class="class_1" type="text" name="lname" value={this.state.fields.lname} onChange={this.handleChange} placeholder="Please enter your last name"  />
	<div style={{color:"red",fontWeight:"bold"}}>{errors["fname"]}</div> 

	<br/><label for="phone">Phone Number:</label>
	<input class="class_2" type="tel" name="mobileno" placeholder="Please enter your Phone Number"  value={this.state.fields.mobileno} onChange={this.handleChange}/>
	<div style={{color:"red",fontWeight:"bold"}}>{errors["mobileno"]}</div>

	<br/><label  for="adressstreet">Address(Street):</label>
	<input class="class_2" type="text" name="addressstreet" value={this.state.fields.addressstreet} onChange={this.handleChange}placeholder="Please enter the Street Name" />

	<br/><label  for="adressroad">Address(Road):</label>
	<input class="class_2" type="text" name="adressroad" value={this.state.fields.adressroad} onChange={this.handleChange} placeholder="Please enter the Road Name"  />

	<br/><label class="label" for="city">City:</label>
	<input class="class_3"  type="text" name="city" value={this.state.fields.city} onChange={this.handleChange} placeholder="Please enter your City"  />
	<label class="label" for="postcode">Post Code:</label>
	<input  class="class_3"  type="text" name="postcode" value={this.state.fields.postcode} onChange={this.handleChange} placeholder="Please enter your PostCode"  />

	<br/><label class="label" for="vbody">Vehicle Body Style:</label>
	<select class="select1" name="vbody" id="vbody">
	<option value="Cabriolet">Cabriolet</option>
	<option value="Coupe">Coup</option>
	<option value="Estate">Estate</option>
	<option value="Hatchback">Hatchback</option>
	<option value="Other">Other</option>
	</select>

	<label class="label" for="capacity">Enter Engine Capacity (CC):</label>
	<select className="select2" name="capacity" id="capacity">
	<option value="1000">1000</option>
	<option value="1600">1600</option>
	<option value="2000">2000</option>
	<option value="2500">2500</option>
	<option value="3000">3000</option>
	<option value="Other">Other</option>
	</select>

	<br/><label class="label" for="driver">Number of Additional Drivers:</label>
	<input class="select1" type="number" min="0" max="5" name="driver" placeholder="How many Additional Drivers will there be ?"  /> 

	<br/><label class="label" for="purpose">Will the Vehicle be used for Commercial Purpose ?</label>
	<input type="radio" id="purpose" name="purpose" value="yes"/> Yes    
	<input type="radio" id="purpose" name="purpose" value="no"/> No

	<br/><label class="label" for="purpose">Will the Vehicle be used outside the Registered State ?</label>
	<input type="radio" id="state" name="state" value="yes"/> Yes    
	<input type="radio" id="state" name="state" value="no"/> No

	<br/><label class="label" for="mvalue">Current Market Value:</label>
	<select class="select1" name="mvalue" id="mvalue">
	<option value="<10000">0 - 10000</option>
	<option value="<20000">10000 - 20000</option>
	<option value="<30000">20000 - 30000</option>
	<option value="<40000">30000 - 40000</option>
	<option value="<50000">40000 - 50000</option>
	</select>

	<br/><label class="label" for="regdate">When the Vehicle was first Registered ?</label>
	<input class="class_3" type="date" id="regdate" name="regdate"/>
	
	<br/><div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
	<input  class="registerbtn" type="submit" value ="Submit" />

	</div>
		</form>
	</div>
   );
  }
}
 
export default Registration;