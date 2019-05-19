import BaseComponent from '../../../components/core/BaseComponent';
import styleObj from './PlayerVediosComponent.scss'
import { Player } from 'video-react';

class PlayerVediosComponent extends BaseComponent {
  // 构造函数
  constructor (props) {
    super(props);
    let movieUrl = props.history.location.movieUrl;
    this.state = {
      // 选中的视频地址
      vedioUrl: movieUrl,
      intervalFlag: ''
    };
  }

  componentDidMount () {
    const that = this;
    this.state.intervalFlag = setInterval(function () {
      console.log("this.state.intervalFlag")
      const { player } = that.refs.player.getState();
      if (player.ended === true) {
        that.goPage('home');
      }
    }, 2000);
  }

  componentWillUnmount () {
    clearInterval(this.state.intervalFlag)
  }

  // 获取播放电影的代码
  getMovieHtml () {
    let {vedioUrl} = this.state;
    if (vedioUrl !== "") {
      return (<Player ref="player" autoPlay={true}>
        <source src={vedioUrl} />
      </Player>)
    } else {
      return ""
    }
  }

  render () {
    let playerHtml = this.getMovieHtml();
    return (
      <div className={styleObj.LatestVediosComponent}>
        <div className={styleObj["vedio-container"]}>
          {playerHtml}
        </div>
      </div>
    );
  }

}

export default PlayerVediosComponent;
