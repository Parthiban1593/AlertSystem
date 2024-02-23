import { Component ,TemplateRef,ViewChild} from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import html2canvas from 'html2canvas';
import { AlertDetails } from 'src/app/models/alert-details.model';
import { DataService } from 'src/app/services/data.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent {

  @ViewChild('motionCaptureDialog') motionCaptureDialog: TemplateRef<any> = {} as TemplateRef<any>;
  @ViewChild('alertDetialsDialog') alertDetialsDialog: TemplateRef<any> = {} as TemplateRef<any>;
  
  @ViewChild('map') map: google.maps.Map | undefined;
  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 4;
  display: google.maps.LatLngLiteral | undefined;
  markerPositions: google.maps.LatLngLiteral[] = [
    { lat: 27.638471699392344, lng: 2.5957031249999973},
    { lat: 27.32658305694333, lng: 16.833984374999996 },
    { lat: 14.980549930938247, lng: 18.328124999999996 }];
  markers : any = new google.maps.Marker({
    draggable : false,
    position:{
      lat: 27.638471699392344, lng: 2.5957031249999973,
    },
    label: {
      color: 'black',
      text: 'Marker label ',
    },
    title: 'Marker title ',
    icon: 'assets/icons/battery.svg'
  });
  markersArr : any[] = [
    {
      id: 1,
      action : "battery",
      markerPosition : {
        lat: 27.638471699392344, lng: 2.5957031249999973,
      },
      icon: 'assets/icons/battery.svg'
    },
    {
      id:2,
      action : "camera",
      markerPosition : {
        lat: 27.32658305694333, lng: 16.833984374999996,
      },
      icon: 'assets/icons/camera.svg'
    },
    {
      id:3,
      action : "door",
      markerPosition : {
        lat: 14.980549930938247, lng: 18.328124999999996,
      },
      icon: 'assets/icons/door-close.svg'
    }
  ];

  dataSource: MatTableDataSource<AlertDetails> = {} as MatTableDataSource<AlertDetails>;
  displayColumns : string[] = ["Location","Time","Description"]
  constructor(private webSocketService: SocketService,private dialog: MatDialog,private dataService : DataService) {}
  moveMap(event: google.maps.MapMouseEvent) {
    this.center = (event.latLng!.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    this.display = event.latLng?.toJSON();
  }
  ngOnInit() {
    this.markersArr.push(this.markers)
    this.webSocketService.getClientMessage().subscribe((res: any)=>{
      console.log(res)
    })

    this.webSocketService.getMotionDetectionAlert().subscribe((res: any)=>{
     this.dialog.open(this.motionCaptureDialog, {
        width : "50%",
        height : "50%",
        disableClose: true,
        autoFocus: false
      });
    })

    this.webSocketService.getHeatIndicationAlert().subscribe((obj: any)=>{
      let markerIndx = this.markersArr.findIndex(o => o.id == obj.deviceId);
      if(obj.heatPercent < 60){
       this.markersArr[markerIndx].icon = "assets/icons/battery_warning.svg";
      }else {
        this.markersArr[markerIndx].icon = "assets/icons/battery.svg";
      }
    })
    this.webSocketService.getDoorOperationAlert().subscribe((obj: any)=>{
      //let obj = JSON.parse(res);
      let markerIndx = this.markersArr.findIndex(o => o.id == obj.deviceId);
      if(obj.operation =="open"){
       this.markersArr[markerIndx].icon = "assets/icons/door-open.svg";
      }else {
        this.markersArr[markerIndx].icon = "assets/icons/door-close.svg";
      }
    })
  }

  getAlertDetails(marker : any){
    this.dataService.getOpertationData(marker.action).subscribe((res : AlertDetails[])=>{
      this.dialog.open(this.alertDetialsDialog, {
        width : "60%",
        height : "60%",
        disableClose: true,
        autoFocus: false
      });
      this.dataSource = new MatTableDataSource(res);
       console.log(res)
    })
  }

  captureScreenshot() {
    html2canvas(document.body,{
      useCORS: true,
      allowTaint: false}).then(canvas => {
        var tempcanvas=document.createElement('canvas');
        tempcanvas.width=1350;
        tempcanvas.height=700;
        var context : any=tempcanvas.getContext('2d');
        context.drawImage(canvas,0,0,1350,700,0,0,1350,700);
        var link=document.createElement("a");
        this.sendScreenshot(tempcanvas.toDataURL('image/jpg'));
    });
  }

  sendScreenshot(imageData: string) {
    // Send imageData to the WebSocket server
    // WebSocket implementation goes here
    this.dataService.saveScreenShot(imageData).subscribe((res : any)=>{

    });
  }
}
