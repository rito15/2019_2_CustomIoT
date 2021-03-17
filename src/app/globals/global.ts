import {HttpClient, HttpHandler, HttpHeaders} from '@angular/common/http';

// 모듈 고유 번호
export enum NAME {
    UNDEFINED ,
    DEBUGGING,
    LOGIC_TYPE_AND,
    LOGIC_TYPE_OR,
    LED_TYPE_A,
    BUZZER_TYPE_A,
    TEMPHUMI_TYPE_A,
    MOTION_TYPE_A
}

// 모듈 종류 번호
export enum MTYPE {
    UNKNOWN,
    NETWORK_MODULE,
    LOGIC_MODULE,
    OUTPUT_MODULE,
    INPUT_MODULE,
}

// 센서 값 고유 번호
export enum AXIS {
    UNUSED,
    LED_RED,
    LED_GREEN,
    LED_BLUE,
    BUZZER_SOUND,
    TEMPHUMI_TEMPERATURE,
    TEMPHUMI_HUMIDITY,
    MOTION_FIND,
    LOGIC_MODE  // => 헤더에서 0: And / 1: Or
}

// 현재 모드 : 논리(AND, OR), 프로그래밍
export enum MODE {
    UNKNOWN,
    LOGIC_AND_MODE,
    LOGIC_OR_MODE,
    PROGRAMMING_MODE
}

export class Global {

    // http 통신할 URL
    public static targetUrl = 'https://my-json-server.typicode.com/lacolico/NyangMusic/';
    // targetURL 뒤에 붙일 특정 페이지
    public static urlList = [
        '',             // 아무것도 아님

        'devices/',      // 헤더 요청
        'module_count/', // 슬레이브 모듈 개수 요청 : 필요 X
        'event/',        // 이벤트 등록
        'is_change/',    // 변경사항 있는지 확인 : 필요 X
        'now_mode/'      // 논리 모드인지 블록 모드인지 확인 : 필요 x
    ];

    // Data Container Variables(Global)
    public static headers = [];     // 1. 헤더 정보
    public static moduleNum = 0;    // 2. 모듈 개수
    public static nowMode = MODE.UNKNOWN;  // 5. 현재 모드(And/Or/Programming)

    public static headerInitalized = false; // 한 번이라도 헤더가 초기화된 적 있는지 검사

    // homePage Globals ==================================

    public static tempMin = 0;
    public static tempMax = 50;
    public static humiMin = 20;
    public static humiMax = 90;
    public static motionValue = 0;

    // 온도 값 설정
    public static setTempValues(min, max) {
        Global.tempMin = min;
        Global.tempMax = max;
    }

    // 습도 값 설정
    public static setHumiValues(min, max) {
        Global.humiMin = min;
        Global.humiMax = max;
    }

    // 모션 값 설정 : 0 or 1
    public static setMotionValues(value) {
        Global.motionValue = value;
    }

    // ===================================================

    // Methods
    public static printHeaders() {
        console.log('headers : ');
        console.log(this.headers);
    }

    public static printModuleNum() {
        console.log('Modules : ', this.moduleNum);
    }

    // 'name' 속성 값으로 해당하는 enum 리턴
    public static GetSensorNumber(sensorName) {
        switch (sensorName) {
            default: return 0;
            case 'TempHumi': return NAME.TEMPHUMI_TYPE_A;
            case 'MotionDetector': return NAME.MOTION_TYPE_A;
            case 'LED': return NAME.LED_TYPE_A;
            case 'Sound': return NAME.BUZZER_TYPE_A;
        }
    }

    // http : json 전송 및 수신 (기본 형태)
    public static getHttpRequest(http, url, page, optionJSON) { // add
        http.get(url + page, optionJSON)
            .toPromise()
            .then(res => {
                console.log(res);
                return res;
            })
            .catch(err => {
                console.log(err);
                return {};
            });
    }

    // HTTP 1. 헤더 정보 받아오기 : 헤더 정보[1] 및 모듈 개수[2], 지금 모드[3]까지 초기화
    public static httpGetHeaders(http) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            }),
            observe: 'response'
        };

        http.get(Global.targetUrl + Global.urlList[1], {})
            .toPromise()
            .then(res => {

                Global.headers = res;           // [1] 헤더에 초기화
                Global.moduleNum = res.length;  // [2] 모듈 개수 초기화
                Global.checkThisMode();         // [3] 지금 모드 초기화

                Global.headerInitalized = true;

                console.log('HTTP 1 - Header : ', Global.headers);
                console.log('HTTP 1 - ModuleNum : ', Global.moduleNum);
                console.log('HTTP 1 - Now Mode : ', Global.nowMode);

                return res;
            })
            .catch(err => {
                console.log('HTTP 1 : Get Header - ERROR');
                alert(Global.targetUrl + Global.urlList[1] + ' : Failed');
                Global.headerInitalized = false;
                return {};
            });
    }

    // HTTP 2. 모듈 개수 요청하기 (안쓰고, 헤더에서 length 받아오면 됨)
    public static httpGetModuleNum(http) {
        http.get(Global.targetUrl + Global.urlList[2], {})
            .toPromise()
            .then(res => {
                console.log('HTTP 2 - Module Number : ', res.result_msg);

                Global.moduleNum = res.result_msg;   // 모듈 개수에 초기화

                return res;
            })
            .catch(err => {
                console.log('HTTP 2 : Get Module Number - ERROR');
                return {};
            });
    }

    // HTTP 3. 이벤트 등록하기
    public static httpAddEvent(http, eventCode) {
        http.get(Global.targetUrl + Global.urlList[3], eventCode)
            .toPromise()
            .then(res => {
                console.log('HTTP 3 - Add Event : ', res.result_msg);

                return res;
            })
            .catch(err => {
                console.log('HTTP 3 : Add Event - ERROR');
                return {};
            });
    }

    // 헤더를 분석하여 지금 논리 모드인지 프로그래밍 모드인지 결정
    public static checkThisMode() {
        let modeValue = MODE.PROGRAMMING_MODE;

        Global.headers.forEach( header => {
           switch (header.name) {
               case NAME.LOGIC_TYPE_AND:
                   modeValue = MODE.LOGIC_AND_MODE;
                   break;

               case NAME.LOGIC_TYPE_OR:
                   modeValue = MODE.LOGIC_OR_MODE;
                   break;
           }
        });

        Global.nowMode = modeValue;
        return Global.nowMode;
    }

    // 헤더를 분석하여 해당 센서가 존재하는지 여부 리턴
    // 파라미터 : Global.NAME.enum값
    public static hasSensor(globalNameEnum) {

        let boolValue = false;

        Global.headers.forEach( header => {
            if (header.name === globalNameEnum) {
                boolValue = true;
            }
        });

        return boolValue;
    }

    Constructor(http2: HttpClient) {}
}
