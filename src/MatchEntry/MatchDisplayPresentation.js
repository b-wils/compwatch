import React, { Component } from 'react';
import styled from 'styled-components/macro';
import {css} from 'styled-components';
import {InputNumber, Switch} from 'antd';

import {getImageForHero, getImageForMap, capitalize} from '../util'

class MatchEntryPresentation extends Component {

  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.textInput = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textInput.current.focus();
    this.props.handleSubmit(event)
  }

  render() {
    return (
      <div className="MatchEntry">
        
        <FlexContainer>
          <div style={{width: '100%'}}>
            <span> Placement Match: <Switch defaultChecked={this.props.placementMatch} /> </span>
            Current SR: <InputNumber value={this.props.currentSR} onChange={this.props.currentSRChange}/>
            New SR: <InputNumber value={this.props.newSR} onChange={this.props.newSRChange} autoFocus={true} ref={this.textInput}/>
            <ResultRadio currentResult={this.props.result} onChange={this.props.resultSelectChange} />
          </div>

          <RootHeroContainer>
          {this.props.sortedHeroes ? 
            Object.keys(this.props.sortedHeroes).map((heroType, i) => {
              return (
                <HeroListContainer key={heroType}>

                  <CategoryTitle> {capitalize(heroType)} </CategoryTitle>
                  {this.props.sortedHeroes[heroType].map((item,i) => 
                    <PickerElement type='checkbox' key={item.name} imgUrl={getImageForHero(item.name)} name={item.name} onChange={this.props.heroSelectChange} checked={this.props.selectedHeroes[item.name]  ? true : false}/>
                  )}
                  
                </HeroListContainer>
              )
            })
            : <span> Loading Heroes </span>
          }
          </RootHeroContainer>

          <div>
          {this.props.sortedMaps ? 
            Object.keys(this.props.sortedMaps).map((mapType, i) => {
              return (
                <div key={mapType}>
                  <CategoryTitle> {capitalize(mapType)} </CategoryTitle>
                  
                  {this.props.sortedMaps[mapType].map((item,i) => 
                    <PickerElement type='radio' imgUrl={getImageForMap(item.name)} key={item.name} name={item.name} onChange={this.props.mapSelectChange} checked={this.props.selectedMap === item.name  ? true : false}/>
                  )}
                  
                </div>
              )
            })
            : <span> Loading Maps </span>
          }
          </div>

          
        </FlexContainer>
      </div>
    );

  }
}

const PickerElement = ({name, onChange, checked, imgUrl, type}) => {
  return (
      <span>
        <input type={type} name={name} id={name} style={{display:'none'}} onChange={onChange} checked={checked} value={checked}/>
        <PickerItem htmlFor={name} checked={checked}>
          <PickerImage src={imgUrl} alt={name} title={name} />
          <PickerText> {name} </PickerText>
        </PickerItem>
      </span>
    );
};

const ResultRadio = ({currentResult, onChange}) => {
  return (
      <span>
        <ResultRadioElement name='Win' onChange={onChange} checked={currentResult === 'win'  ? true : false}/>
        <ResultRadioElement name='Draw' onChange={onChange} checked={currentResult === 'draw'  ? true : false}/>
        <ResultRadioElement name='Loss' onChange={onChange} checked={currentResult === 'loss'  ? true : false}/>
      </span>
    );
}

const ResultRadioElement = ({name, onChange, checked}) => {
  return (
      <span>
        <input type='radio' name={name} id={name} style={{display:'none'}} onChange={onChange} checked={checked} value={checked}/>
        <ResultLabel htmlFor={name} checked={checked}>
           {name}
        </ResultLabel>
      </span>
    );
};

const CategoryTitle = styled.h3 `
  flex-basis: 100%;
  text-align: center;
`

const ResultLabel = styled.label `
    height: 30px;
    width: 80px;
    display: inline-block;
    border-width: 2px;
    border-style: solid;
    border-color: ${props => props.checked ? props.theme.primary : props.theme.mid};
`


const FlexContainer = styled.div `
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`

const RootHeroContainer = styled.div `
  margin: 10px;
  max-width: 900px;
`

const HeroListContainer = styled.div `
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`

const PickerItem = styled.label `
      height: 90px;
      width: 101px;
      display: inline-block;
      padding: 0 0 0 0px;
      border-width: ${props => props.checked ? "3px" : "3px"};
      border-style: solid;
      border-color: ${props => props.checked ? props.theme.primary : props.theme.mid};
      position: relative;
      filter: ${props => props.checked ? "grayscale(0%)" : "grayscale(70%)"};
      margin: 2px;
      ${css`
          &:hover {
            -webkit-filter: grayscale(0%); /* Safari 6.0 - 9.0 */
            filter: grayscale(0%);
          }
      `}
`;

const PickerImage = styled.img `
  width: 100%;
  height: 100%;
`;

const PickerText = styled.span `
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translate(-50%, 0);
  color: white;
  text-shadow: -1px -1px 1px rgba(0,0,0,0.667), 1px 1px 1px #000000;
`

export default MatchEntryPresentation