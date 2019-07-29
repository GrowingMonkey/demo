import {
  PureComponent,Component
} from "react";
import {Select,TimePicker,Button} from 'antd';
import moment from 'moment';
const styles={
    timePicker:'timePicker'
}
export default class MyTimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inithead:0,
      timeArray:[],
      startTime:4,
      endTime:0
    };
  }
  componentDidMount(){
    
  }
  addTime(){
    const {startTime,endTime}=this.state;
    let {timeArray=[]}=this.state;
    if(timeArray.lenght!=0){
      timeArray.map((v,i)=>{
       let newArray=v.split("-");
       
      })
    }
    timeArray.push(`${startTime}-${endTime}`);
    this.setState({timeArray});
    console.log(this.state);
  }
  onChange(value, dateString){
    this.setState({
      startTime:dateString,
    })
  }
  render(){
    const {startTime,endTime,timeArray}=this.state;
    console.log(timeArray);
      let disableArray=[];
      for(let i=0;i<24;i++){
        if(i<=startTime){
          disableArray.push(i);
        }
      }
    let initH=0;
    const format = 'HH';
      return (<div className = {styles.timePicker} >
                <TimePicker defaultValue={moment(startTime, format)}  format={format} size="large" onChange={this.onChange.bind(this)}/>
                <span > ~ </span> 
                <TimePicker defaultValue={moment(23, format)} disabledHours={()=>disableArray} format={format} size="large"/>
                <Button onClick={this.addTime.bind(this)}>添加</Button>
                <h1>
                {
                timeArray.map((v,i)=><span key={i} style={{marginRight:20}}>{v}</span>)
                }
                </h1>
             </div>)
        }
}
