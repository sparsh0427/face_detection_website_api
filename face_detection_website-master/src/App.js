import React from 'react';
import Navigation from './Components/Navigation/Navigation.js'
import Logo from './Components/Logo/Logo.js'
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js'
import Rank from './Components/Rank/Rank.js'
import Register from './Components/Register/Register.js'
import './App.css';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js'
import Signin from './Components/Signin/Signin.js'
import Particles from 'react-particles-js';




const paramOptions = 
{
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 500
      }

    }
  }
}

class App extends React.Component {

  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSigniedIn: false,
      user:{
          id:'',
          name:'',
          email: '',
          entries: 0,
          joined: ''
      }
    }
  }

  loadUser = (data) =>{
    this.setState({user:{
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }

  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box)
    this.setState({box: box})
  }


  onInputChange = (event) =>{
    this.setState({input:event.target.value})
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input })
    console.log("click");
    fetch('http://localhost:3000/imageUrl',{
      method:'post',
      headers:{'Content-Type':'application/JSON'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
      .then( (response) => {
        if(response) {
          fetch('http://localhost:3000/image',{
            method:'put',
            headers:{'Content-Type':'application/JSON'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              // this.setState({user:{  //This will change the entire user  but we dont want this to happend
              //   entries:count
              // }})

              this.setState(Object.assign(this.state.user,{ entries: count }))
            })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) =>{
    if(route === 'signout'){
      this.setState({isSigniedIn:false})  
    }else if(route == 'home'){
      this.setState({isSigniedIn:true})  
    }
    this.setState({route:route})
    // this.setState({imageUrl: '' })
  }


  render() {
    return(
      <div className="App">
          <Particles className='particles'
            params={paramOptions}
          />
        <Navigation isSignedIn = {this.state.isSigniedIn} onRouteChange={this.onRouteChange} />
        { this.state.route === 'home'
        ? <div> 
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries} />
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>  
        </div>
        :(
          this.state.route === 'signin'
          ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          :<Register loadUser = {this.loadUser} onRouteChange={this.onRouteChange} />
        )
      }
      </div>
    );
  } 
    
}

export default App;
