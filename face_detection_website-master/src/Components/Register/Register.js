import React from 'react';


class Register extends React.Component{

    constructor(props){
        super(props);  //because we need to access the props
        this.state = {
            email : '',
            password : '',
            name: ''
        }
    }

    onEmailChange = (event) => {
        this.setState({email: event.target.value})
    }

    
    onPsswordChange = (event) => {
        this.setState({password: event.target.value})
    }

    onNameChange = (event) => {
        this.setState({name: event.target.value})
    }

    onSubmitSignIn = () => {
        fetch('http://localhost:3000/register',{     //fetch by default acceps GET thats why we are defining a second parameter
            method: 'post',  
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name,
            })
        })
            .then(response => response.json()) //TO verify signing in //
            .then(user => {
                if(user.id){
                    this.props.loadUser(user)
                    this.props.onRouteChange('home')
                }
            })
        
    }

    render(){

        const {onRouteChange} = this.props

        return(
            <div>
                <article className="center br3 ba  b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5">
                    <main className="pa4 black-80">
                    <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Register</legend>
                        <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                        <input 
                        onChange={this.onNameChange}
                        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                        type="name" 
                        name="name"  
                        id="name"/>
                        </div>
                        <div className="mv3">
                        <label className="db fw6 lh-copy f6" htmlFor="password">Email</label>
                        <input 
                        className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                        onChange={this.onEmailChange}
                        type="email" 
                        name="email-address"  
                        id="email-address"/>
                        </div>
                        <div className="mv3">
                        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                        <input 
                        className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                        onChange={this.onPsswordChange}
                        type="password" 
                        name="password"  
                        id="password"/>
                        </div>
                    </fieldset>
                    <div className="">
                        <input 
                        onClick= { this.onSubmitSignIn }
                        className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                        type="submit"
                         value="Register"/>
                    </div>
                    <div className="lh-copy mt3">
                        
                    </div>
                    </div>
                </main>
            </article>
          </div>
          
        );
    }
} 
    
export default Register;