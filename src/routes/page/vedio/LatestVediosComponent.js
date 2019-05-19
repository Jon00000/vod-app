import BaseComponent from '../../../components/core/BaseComponent';
import styleObj from './LatestVediosComponent.scss'
import Slider from "react-slick"
import { Player } from 'video-react';

class LatestVediosComponent extends BaseComponent {
  // 构造函数
  constructor (props) {
    super(props);
    this.state = {
      // 选中的视频地址
      vedioUrl: '',
      currentSlide: 0,
      // 是否是手机模式，如果显示屏宽度超过720px，就是PC模式，小于720px就是手机模式
      isMobileMode: false,
      serverData: []
    };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.keyLogic = this.keyLogic.bind(this);
    this.resizeLogic = this.resizeLogic.bind(this);
    this.getRequest = this.getRequest.bind(this);
    this.getSeverData = this.getSeverData.bind(this);
    this.getSeverData()
  }

  componentDidMount () {
    // 添加 resize 绑定事件
    window.addEventListener(
      "keydown",this.keyLogic,false
    );

    // 添加 resize 绑定事件
    window.addEventListener(
      "resize",this.resizeLogic,false
    );
    // 第一次做计算，判断模式
    this.resizeLogic();
  }

  componentWillUnmount () {
    // 删除绑定的resize事件
    window.removeEventListener("keydown",this.keyLogic);
    // 删除绑定的resize事件
    window.removeEventListener("resize",this.resizeLogic);
  }

  getRequest(url) {
    const that = this;
    fetch(url,{
      method:"GET"
    }).then((response) =>{
        if(response.status>=200 && response.status<300){
          return Promise.resolve(response);
        }else{
          return Promise.reject(new Error(response.statusText));
        }
      })
      .then((response) => {
        return response.json();
      })
      .then(function(data){
        let newArr = data.entries.filter(function (currentObj, index) {
          var result = ((currentObj.images[0].url !== undefined) && (currentObj.images[0].url !== '') && (currentObj.images[0].url !== null));
          if (result) {
            return true;
          }else{
            return false;
          }
        })
        that.setState({
          serverData: newArr
        })
      })
      .catch(function(err){
        console.error('response error!');
      });
  }

  // 从服务器获取数据
  getSeverData () {
    var url='https://demo2697834.mockable.io/movies';
    this.getRequest(url)
  }

  next() {
    this.slider.slickNext();
    this.state.currentSlide = this.slider.innerSlider.state.currentSlide;
  }
  previous() {
    this.slider.slickPrev();
    this.state.currentSlide = this.slider.innerSlider.state.currentSlide;
  }

  // 定义逻辑函数
  keyLogic(events){
    var keyStr = events.key;
    if (keyStr === "ArrowRight") {
      this.next()
    }
    if (keyStr === "ArrowLeft") {
      this.previous()
    }
    if (keyStr === "Enter"){
      let {currentSlide, serverData} = this.state;
      let currentMovie = serverData[currentSlide];
      this.selectMovie(currentMovie)
    }
  }

  // 定义逻辑函数
  resizeLogic(){
    console.log(document.documentElement.clientWidth)
    let screenWidth = document.documentElement.clientWidth;
    // 显示屏宽度大于720px则是PC模式
    if (screenWidth > 720) {
      this.setState({
        isMobileMode: false
      });
    }else{ // 显示屏宽度小于于720px则是手机模式
      this.setState({
        isMobileMode: true
      });
    }
  }

  // 存储历史记录
  storeHistory (movieObj) {
    // 用数组来记录查看的记录，有顺序的
    let movieHistory = localStorage.getItem('movie_history');
    // 用JSON对象来判断是否重复，如果
    let movieHistoryJson = localStorage.getItem('movie_history_json');
    if (movieHistory === null || movieHistory === undefined) {
      movieHistory = [];
      movieHistoryJson = {};
    }else{
      movieHistory = JSON.parse(movieHistory);
      movieHistoryJson = JSON.parse(movieHistoryJson);
    }
    // 如果不存在,则添加数据
    if (movieHistoryJson[movieObj.id] === undefined) {
      movieHistory.unshift(movieObj);
      localStorage.setItem('movie_history', JSON.stringify(movieHistory));
      movieHistoryJson[movieObj.id] = movieObj.id;
      localStorage.setItem('movie_history_json', JSON.stringify(movieHistoryJson));
    } else { // 如果存在，删除之前的对象，将现在的对象排在最前面
      for (var i = 0; i < movieHistory.length; i++) {
        var currentObj = movieHistory[i];
        if (currentObj.id === movieObj.id) {
          movieHistory.splice(i, 1);
          break;
        }
      }
      movieHistory.unshift(movieObj);
      localStorage.setItem('movie_history', JSON.stringify(movieHistory));
      movieHistoryJson[movieObj.id] = movieObj.id;
      localStorage.setItem('movie_history_json', JSON.stringify(movieHistoryJson));
    }
  }

  // 选择电影
  selectMovie (movieObj) {
    // 存储选择电影的历史记录
    this.storeHistory(movieObj);
    let mp4Url = movieObj.contents[0].url;
    // console.log("mp4Url:" + mp4Url);
    // this.setState({
    //   vedioUrl: ''
    // });
    // window.setTimeout(function () {
    //   that.setState({
    //     vedioUrl: mp4Url
    //   });
    // },500)
    let pathObj = {
      // pathname 这个值是不能改的，表示Link需要跳转的界面
      pathname: 'player',
      movieUrl: mp4Url
    };
    this.goPage(pathObj);
  }

  // 获取电影列表的html代码
  getVediosHtmlByData () {
    let {serverData} = this.state;
    let dataArr = serverData;
    var vediosHtml = dataArr.map((item, index) => {
      return (
        <div className={styleObj["vedio-item"]} onClick={this.selectMovie.bind(this,item)} key={index}>
          <div className={styleObj["vedio-item-img"]}>
            <img src={item.images[0].url} alt=""/>
          </div>
          <div className={styleObj["vedio-item-title"]}>
            {item.title}
          </div>
        </div>
      );
    })
    return vediosHtml;
  }

  // 获取手机模式电影的html代码
  getVediosMobileHtmlByData () {
    let {serverData} = this.state;
    let dataArr = serverData;
    var vediosHtml = dataArr.map((item, index) => {
      return (
        <div className={styleObj["vedio-item"]} onClick={this.selectMovie.bind(this,item)} key={index}>
          <div className={styleObj["vedio-item-img"]}>
            <img src={item.images[0].url} style={{paddingRight: '10px'}} alt=""/>
          </div>
          <div className={styleObj["vedio-item-title"]}>
            {item.title}
          </div>
        </div>
      );
    })
    return vediosHtml;
  }

  // 获取播放电影的代码
  getMovieHtml () {
    let {vedioUrl} = this.state;
    if (vedioUrl !== "") {
      return (<Player autoPlay={true}>
        <source src={vedioUrl} />
      </Player>)
    } else {
      return ""
    }
  }

  render () {
    let {isMobileMode} = this.state;
    let vediosHtml = this.getVediosHtmlByData();
    let vediosMobileHtml = this.getVediosMobileHtmlByData();
    let playerHtml = this.getMovieHtml();
    var settings = {
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      centerMode: true,
      variableWidth: true
    };
    return (
      <div className={styleObj.LatestVediosComponent}>
        {
          !isMobileMode ? (
            // 横向滚动的效果
            <div>
            <div className={styleObj["vedio-list"]}>
              {/*ref={c => (this.slider = c)} 给插件指向一个句柄 */ }
              <Slider {...settings} ref={c => (this.slider = c)}>
                {vediosHtml}
              </Slider>
            </div>
            <div className={styleObj["vedio-container"]}>
              {playerHtml}
            </div>
          </div>) : (
            // 响应式的界面
            <div>
              <div className={styleObj["vedio-list"]}>
                {vediosMobileHtml}
              </div>
            </div>)
        }
      </div>
    );
  }

}

export default LatestVediosComponent;
