import React, { Component } from "react";

export default class Login extends Component {
    render() {
        return (
            <form>
                <h3>Log into the Portal</h3>

                <div className="form-group">
                    <label>User Name</label>
                    <input type="text" className="form-control" placeholder="Enter User Name" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" />
                </div>
{/* 
                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div> */}
                
                <p className="text-center">
                <br/><button type="submit" className="btn btn-primary btn-block ">Login</button>
                </p>
                <hr/>

                <p className="text-center">
                    I am New Here
                <p class="my-border" ><a href="#">Create Account</a></p>
                </p>
            </form>
        );
    }
}