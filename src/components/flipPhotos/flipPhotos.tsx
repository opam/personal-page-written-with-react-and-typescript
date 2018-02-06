import * as React from 'react';
import './flipPhotos.css';
import './flipping.css';
import './flipPhotos_mobile.css';


export default class FlipPhotos extends React.Component<{
  flipPhotosBackground?:string;
  flipPhotosBottom?:string,
  flipPhotos:Array<string>;
  numberOfRows:number;
}, {}> {

  MOVE_PHOTO_LOWER = 45;
  CARD_ELEMENT_CSS = 'card';
  containerNode:any;
  flipInterval: any;

  componentDidMount() {
    this.startAll();
  }
  componentDidUpdate() {
    this.startAll();
  }

  componentWillUnmount() {
    this.stopFlip();
  }

  startAll() {
    if(this.containerNode) {
      this.setDimensions(this.containerNode);
      this.startFlip(this.containerNode);
    }
  }

  stopFlip() {
    if(this.flipInterval !== undefined)
      clearInterval(this.flipInterval);
  }

  startFlip(container:any) {
    this.stopFlip();

    const cards = container.querySelectorAll('.'+this.CARD_ELEMENT_CSS);
    const miliseconfsTimeout = ((1000 / cards.length)*12);


    // initial flipPhotos
    this.flipRandomImage(true);  

    this.flipInterval = setInterval(() => {
      // loop flip
      this.flipRandomImage();
    }, miliseconfsTimeout.toFixed());
  }

  flipRandomImage(flipAll = false) {
    if(this.containerNode) {
      const cards = this.containerNode.querySelectorAll('.'+this.CARD_ELEMENT_CSS);
      if(cards === undefined || cards === null || cards.length < 1)
        return;

      if(this.props.flipPhotos) {
        this.setRandomImage(this.CARD_ELEMENT_CSS, cards, this.props.flipPhotos, flipAll);
      }
    }
  }

  setDimensions(container:any) {
    const containerHeight = parseInt(container.offsetHeight,10);
    const containerWidth = parseInt(container.offsetWidth,10);
    const numberOfRows = container.querySelectorAll('.'+this.CARD_ELEMENT_CSS).length;
    const height = Number((containerHeight/numberOfRows).toFixed(1));
    const allImages = container.querySelectorAll('.partial-image');
    for(let i=0;i<allImages.length;i++) {
      const image = allImages[i];
      const rowNumber = parseInt(image.getAttribute('data-in-row'),10);
      image.style.top = (((rowNumber*height)+this.MOVE_PHOTO_LOWER)*-1)+'px';
      image.style.backgroundSize = '100% '+numberOfRows*100+'%';
      //image.style.height = containerHeight+'px';
      image.style.width = containerWidth+'px';
    }

    const spinRows = container.querySelectorAll('.spin-row');
    for(let i=0;i<spinRows.length;i++) {
      const spinRow = spinRows[i];
      spinRow.style.height = (100/numberOfRows.toFixed(1)) + '%';
    }
  }

  setRandomImage(elementClass:string, elements:any, srcs:Array<string>, flipAll = false) {
    let row = this.getRandomInt(0, elements.length);
    const randomImageIndex = this.getRandomIntOtherThan(0, srcs.length, row);
    const src = srcs[randomImageIndex];

    if(flipAll === false) {
      this.setImage(elementClass, elements, src, row);

      // FLIP SEVERAL AT ONCE
      if (this.getRandomInt(0, 10) > 7 && flipAll === false) {
        this.setRandomImage(elementClass, elements, srcs); // call once again
      }
    } else {
      console.log('flip all rows');
      for(let index = 0; index < elements.length;  index++) {
        this.setImage(elementClass, elements, src, index);
        console.log(index);
      }
    }
  }

  setImage(elementClass:string, elements:any, src:string, row:number) {
    var element = elements[row];
    var side = '';
    if(element.className===elementClass) {
      element.className=elementClass+ " applyflip";
      side = '.cardBack';
    } else {
      element.className=elementClass;
      side = '.cardFront';
    }
    const image = element.querySelector('.content '+side+ ' > img');

    image.setAttribute('src', src);
    image.className = "partial-image " + this.getRandomFilterClass();
    console.log('spin row:'+row+' with image:'+src);
  }

  getRandomImage() {
    const srcs = this.props.flipPhotos;
    const index = this.getRandomInt(0, srcs.length);
    return srcs[index];
  }

  getRandomIntOtherThan(min: number, max: number, otherThan?: number): number {

      const randomInt = this.getRandomInt(min, max);

      if(otherThan === undefined) {
        return randomInt;
      }

      const maxTimes = 10;
      let index = 0;
      while(index < maxTimes) {
      	const result = this.getRandomInt(min,max);
        index++;
        if(result === otherThan) {
        	if(result === 0) {
            return 1;
          } else {
            return 0;
          }
        } else {
          return result;
        }
      }

      alert('fail, we should never get so far');
      return randomInt;
  }

  getRandomInt(min: number, max: number) {
    const randomNumber = Math.random() * (max - min) + min;
    return parseInt(randomNumber.toString(),10);
  }

  getRandomFilterClass():string {
    const filters = [
      'grayscale',
      'sepia',
      'shadow',
      'opacity',
      /*'art',*/
      'huered',
      ''
    ];
    return filters[this.getRandomInt(0,filters.length)];
  }

  renderRows(numberOfRows:number):any {
    let rows:any = [];
    for (var i = 0; i < numberOfRows; i++) {
        rows.push(this.renderRow(i));
    }
    return rows;
  }

  addBottomPhoto() {
    if(this.props.flipPhotosBottom)
      return <div className="bottom-background"><img src={this.props.flipPhotosBottom} /></div>;
    else
      return "";
  }

  addBackgroundPhoto() {
    if(this.props.flipPhotosBackground)
      return <div className="background"><img src={this.props.flipPhotosBackground} /></div>;
    else
      return "";
  }

  renderRow(numberOfRow:number):any {
    const src = this.getRandomImage(); // on new render will be set random image
    return (
      <div className={`spin-row row${numberOfRow}`} key={'row-'+numberOfRow}>
        <div className="card">
          <div className="content">
             <div className="cardFront">
               <img className="partial-image" data-in-row={numberOfRow} src={src}/>
             </div>
             <div className="cardBack">
               <img className="partial-image" data-in-row={numberOfRow} src={src}/>
             </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    if(! this.props.flipPhotos ) {
        return "";
    }
    return (
      <div className="flipPhotos-container" >
        {this.addBackgroundPhoto()}
        <div id="spin-container" className="spin-container" ref={(element)=>{this.containerNode = element}}>
          {this.renderRows(this.props.numberOfRows)}
        </div>
        {this.addBottomPhoto()}
        <div>
          <div
            className="flipButton"
            onClick={()=> { this.flipRandomImage(true) }}
          >
            Flip
          </div>
        </div>
      </div>
    );
  }
}
