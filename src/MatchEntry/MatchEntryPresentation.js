import React, { Component } from 'react';

class MatchEntryPresentation extends Component {
  render() {
    return (
      <div className="MatchEntry">
        {this.props.message ? <div> {this.props.message}</div> : null}
        <form onSubmit={this.props.handleSubmit}>
          <div>
            Current SR: <input type="text" name="currentSR" value={this.props.currentSR} onChange={this.props.currentSRChange}/>
            New SR: <input type="text" name="newSR" value={this.props.newSR} onChange={this.props.newSRChange}/>
            Result: {this.props.result} SR Change: {this.props.SRDiff}
          </div>

          <div>
          {this.props.sortedHeroes ? 
            Object.keys(this.props.sortedHeroes).map((heroType, i) => {
              return (
                <div key={heroType}>
                  <div>{heroType}:</div>
                  
                  {this.props.sortedHeroes[heroType].map((item,i) => 
                    <HeroPickerItem key={item.name} hero={item} onChange={this.props.heroSelectChange} checked={this.props.selectedHeroes[item.name]  ? true : false}/>
                  )}
                  
                </div>
              )
            })
            : <span> Loading Maps </span>
          }
          </div>

          <div>
          {this.props.sortedMaps ? 
            Object.keys(this.props.sortedMaps).map((mapType, i) => {
              return (
                <div key={mapType}>
                  <div>{mapType}:</div>
                  
                  {this.props.sortedMaps[mapType].map((item,i) => 
                    <MapPickerItem key={item.name} map={item} onChange={this.props.mapSelectChange} checked={this.props.selectedMap === item.name  ? true : false}/>
                  )}
                  
                </div>
              )
            })
            : <span> Loading Maps </span>
          }
          </div>


           <div><input type="submit" value="Submit" /></div> 
        </form>
      </div>
    );

  }
}


const HeroPickerItem = ({hero, onChange, checked}) => {
    var labelStyle = {
      height: "90px",
      width: "101px",
      display:"inline-block",
      padding: "0 0 0 0px",
      borderStyle: 'solid',
      borderColor: 'white',
      position:'relative',
      'textShadow': '-1px -1px 1px rgba(0,0,0,0.667), 1px 1px 1px #000000'
  }

  if (checked) {
    labelStyle['borderColor'] = "red";
    labelStyle['borderStyle'] = "solid";
  }

  return (
      <span>
        <input type="checkbox" name={hero.name} id={hero.name} style={{display:'none'}} onChange={onChange} checked={checked} value={checked}/>
        <label htmlFor={hero.name} style={labelStyle}>
          <img src={getImageFromHero(hero)} title={hero.name} alt={hero.name} width='100%' height='100%' style={{backgroundColor:'black'}} />
          <span style={{position:'absolute', bottom: '5px', left:'50%', transform:'translate(-50%, 0)', color:'white'}}> {hero.name} </span>
        </label>

      </span>
    );
}


function getImageFromHero(hero) {
  return process.env.PUBLIC_URL + "/images/heroes/Icon-" + hero.name.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "_") + ".png";
}

const MapPickerItem = ({map, onChange, checked}) => {
    var labelStyle = {
      height: "90px",
      width: "101px",
      display:"inline-block",
      padding: "0 0 0 0px" ,
      borderStyle: 'solid',
      borderColor: 'white',
      position:'relative',
      'textS  hadow': '-1px -1px 1px rgba(0,0,0,0.667), 1px 1px 1px #000000'
  }

  if (checked) {
    labelStyle['borderColor'] = "red";
  }

  return (
      <span>
        <input type="radio" name={map.name} id={map.name} style={{display:'none'}} onChange={onChange} checked={checked} value={checked}/>
        <label htmlFor={map.name} style={labelStyle}>
          <img src={getImageFromMap(map)} alt={map.name} title={map.name} width='100%' height='100%'/>
          <span style={{position:'absolute', bottom: '5px', left:'40%', transform:'translate(-40%, 0)', color:'white'}}> {map.name} </span>
        </label>
      </span>
    );

}

function getImageFromMap(map) {
  return process.env.PUBLIC_URL + "/images/maps/" + map.name.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "_") + "_link.png";
}

export default MatchEntryPresentation