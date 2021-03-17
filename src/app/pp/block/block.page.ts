import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {last} from 'rxjs/operators';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// 전역변수, 전역메소드 쓸거임
import { Global, NAME, MTYPE, AXIS } from '../../globals/global';

@Component({
  selector: 'app-block',
  templateUrl: './block.page.html',
  styleUrls: ['./block.page.scss'],
})
export class BlockPage implements OnInit {

  listLogic = [
    {
      type: 'IF',
      conds: [],
      actions: []
    },
    {
      type: 'ELSE',
      // conds: [], // else if가 아니라 else이므로 조건 추가 허용 X
      actions: []
    }];
  listSensor = [
    {
      name: 'MotionDetector'
    },
    {
      name: 'TempHumi'
    }
  ];
  listOutput = [
    {
      name: 'LED'   // enum : 3
    },
    {
      name: 'Sound' // enum : 4
    }
  ];
  listCustom = [];  // html 내 if-else문을 그대로 읽어옴
  listTrash = [];
  listFinal = []; // listCustom을 변환하여, 전송하기 위한 구조로 완성
  code = { list: this.listFinal, list_len: 0 };  // json의 최상위 object : listFinal 배열을 담음

  converted = false; // listCustom -> listFinal 변환 했는지 여부

  constructor(public http: HttpClient) {}

  // 드래그앤 드롭으로 새로 추가하는 경우
  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      if (event.previousIndex === 0) {
        this.createNew('I');
      } else {
        this.createNew('E');
      }
    }
  }

  // 드래그앤 드롭으로 버리는 경우
  dropDead(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      this.listTrash.pop();
    }
  }

  // if에서 + 눌러 조건 또는 액션 추가했을 때 호출
  // listCustom에 조건, 액션 추가
  add(item, i) {
    // console.log(item);
    if (i === 0) {
      item.conds.push({});
    } else {
      item.actions.push({});
    }
    console.log('add');
    this.printListCustom();
  }

  // Drag&Drop으로 if 또는 else를 새로 만들었을 경우 호출
  createNew(logic) {
    if (logic === 'I') {
      this.listLogic[0] = {type: 'IF', conds: [], actions: []};
    } else {
      // this.listLogic[1] = {type: 'ELSE', conds: [], actions: []};
      this.listLogic[1] = {type: 'ELSE', actions: []};
    }
    console.log('Create New');
    this.printListCustom();
  }

  // 조건식 부분에서 빈 센서 조건을 클릭하여 새로운 센서 조건을 등록한 경우 호출
  addSen(ev, item) {
    const idx = this.listSensor.findIndex(x => x.name === ev.target.value);
    if (idx !== -1) {
      item.name = this.listSensor[idx].name;
      // item.range = [null, null];
      item.range = [[0, 0], [], [], []];
    }
    console.log('Sensor added');
    this.printListCustom();
  }

  // 액션 부분에서 빈 액션을 클릭하여 새로운 출력 동작을 등록한 경우 호출
  addOut(ev, item) {
    const idx = this.listOutput.findIndex(x => x.name === ev.target.value);
    if (idx !== -1) {
      item.name = this.listOutput[idx].name;
      item.param = [0, 0, 0, 0];
      // item.input = [null, null];
    }
    console.log('Output added');
    // console.log(item.name);
    // console.log(this.listCustom);
    this.printListCustom();
  }

  // 센서 조건식에서 low, high 값이 변동할 때마다 호출
  // range[i][j] 참조
  setRange(ev, item, i, j) {
    // tslint:disable-next-line:radix
    item.range[i][j] = parseInt(ev.target.value);
    console.log('Set Range');
    console.log(item);
    this.printListCustom();
  }

  // 센서 조건식에서 토글이 변동할 때마다 호출
  // [0,0], [1,1]로 range 변경
  // range[i][j] 참조
  setDigitalRange(ev, item, i) {
    item.range[i][0] = item.range[i][1] = ev.target.checked ? 1 : 0;
    console.log('Set Range(Digital)');
    console.log(item);
    this.printListCustom();
  }

  // [1] LED RGB 체크박스 변동 시 호출
  // j : 0~2(R, G, B)
  // [2] 부저 토글 변동 시 호출
  // j : 0
  setLedValue(ev, item, i) {
    item.param[i] = (ev.target.checked === true ? 1 : 0);
    // console.log(ev.target.checked);
    console.log(item.param);
    this.printListCustom();
  }

  // JSON 구조를 전달하기 위한 구조로 변경
  reconstructStatements() {
    // 예외처리 : 헤더가 없는 경우
    if (Global.headerInitalized === false) {
      alert('헤더 정보가 없습니다');
      return;
    }

    // Deep Copy : listCustom -> listFinal
    this.listFinal = this.deepCopy(this.listCustom);

    // 1. range[4][2]를 range[2]로 조건 분리하면서 opt 추가
    this.convert1(this.listFinal);

    // 2. name(string) -> sensor(int) 변환
    this.convert2(this.listFinal);

    // 3. if-else 연결된 꼴에서 if 조건을 분리 및 반전하여 모두 if로 만들고, else 모두 제거
    this.convert3(this.listFinal);

    // 4. 모든 list[i]에서 type 속성 제거
    this.compress1(this.listFinal);

    // 5. 모든 list[i].conds[j], list[i].actions[k]에서 name 속성 제거
    this.compress2(this.listFinal);

    // 6. list 개수에 따라 list_len 초기화, conds 개수에 따라 conds_len 초기화
    this.code.list = this.listFinal;
    this.addLen(this.code);
    // => code 완성

    this.printCode();
    this.converted = true;

    // 성공 알림
    alert('Code Conversion Completed');
  }

  // JSON 치환 1
  // range[4][2]를 range[2]로 조건 분리하면서 opt 추가
  convert1(paramList) {
    console.log('Convert1 Begin');
    this.printListFinal();
    this.printListCustom();

    // list 순회
    paramList.forEach( list => {

      // 예외처리 : IF문이 아닌 경우(ELSE) conds가 없으니 무시
      if (list.type === 'IF') {

        const condsLength = list.conds.length;
        // conds 순회
        for (let i = condsLength - 1; i >= 0; i--) {

          // range를 안갖고 있는 경우 무시
          // if (!list[i].conds.hasOwnProperty('range')) {
          //   continue;
          // }

          const rangeLength = list.conds[i].range.length;
          // range 순회
          for (let j = 0; j < rangeLength; j++) {
            if (list.conds[i].range[j].length < 2) {
              continue;
            }
            // 각 range마다 새롭게 조건 추가
            list.conds.push({
              name: String(list.conds[i].name),
              opt: j,
              range: [list.conds[i].range[j][0], list.conds[i].range[j][1]]
            });
          } // endfor(j : 0 ~ 3)

          // range[4][2] 형태인 conds 제거
          list.conds.splice(i, 1);
        } // endfor(i : condsLength ~ 0)
      } // endif(list.type === 'IF')
    }); // endForEach

    console.log('Convert1 completed');
    this.printListFinal();
  }

  // JSON 치환 2
  // name(string) -> sensor(int) 변환
  // 전제 조건 : 마스터 모듈에 헤더 정보를 요청하여 각 센서의 순서 받아야 함
  convert2(paramList) {
    paramList.forEach( list => {

      // 1. cond.name -> cond.sensor
      if (list.hasOwnProperty('conds')) {
        list.conds.forEach( cond => {

          const nowSensorEnumNumber = Global.GetSensorNumber(cond.name);
          cond.sensor = 0;  // init

          if (Global.headerInitalized === true) {
            Global.headers.forEach( header => {
              if (header.name === nowSensorEnumNumber) {
                cond.sensor = header.id;
              }
            });
          }

          if (cond.sensor === 0) {
            console.log('ERROR : Sensor Is Missing - ', cond.name);
          }
          delete cond.name;
        });
      }

      // 2. actions.name -> actions.sensor
      if (list.hasOwnProperty('actions')) {
        list.actions.forEach( action => {

          const nowSensorEnumNumber = Global.GetSensorNumber(action.name);
          action.sensor = 0;  // init

          if (Global.headerInitalized === true) {
            Global.headers.forEach( header => {
              if (header.name === nowSensorEnumNumber) {
                action.sensor = header.id;
              }
            });
          }

          if (action.sensor === 0) {
            console.log('ERROR : Sensor Is Missing - ', action.name);
          }
          delete action.name;
        });
      }
    });
  }

  // JSON 치환 3
  // if-else 연결된 꼴에서 if 조건을 분리 및 반전하여 모두 if로 만들고, else 모두 제거
  convert3(paramList) {
    console.log('reconstructs.. length: ' + paramList.length + ' | ');

    const lastIndex = paramList.length - 1;
    if (lastIndex <= 0) { this.printListCustom(); return; } // 크기가 0 또는 1이면 ㅂㅂ

    console.log('Convert3 Begin');

    // if - else 재구성 시작
    for (let i = 1; i <= lastIndex; i++) {

      // 연속된 인덱스로 if, else가 이어질 경우, if의 조건을 반전+분리하여 else 조건 추가
      if (paramList[i - 1].type === 'IF' &&
          paramList[i].type === 'ELSE') {

        // 조건 반전하기 전에, 빈 조건들 제거
        for (let j = paramList[i - 1].conds.length - 1; j >= 0 ; j--) {
          if (!paramList[i - 1].conds[j].hasOwnProperty('range') ||
              paramList[i - 1].conds[j].range[0] === null ||
              paramList[i - 1].conds[j].range[1] === null) {
            paramList[i - 1].conds.splice(j, 1);
            console.log('recon - 조건 또는 조건 값이 비어있는 경우 제거 2');
          }
        }

        // conds의 크기만큼 조건 순회 => range 반전하여 else 조건으로 추가
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < paramList[i - 1].conds.length; j++) {

          // IF를 반전시켜 추가한 ELSE 조건이라는 의미로 ELSE-IF(IF, ELSE와는 구분)
          const newType = 'ELSE-IF';
          const newConds = [
            {
              sensor: paramList[i - 1].conds[j].sensor,
              opt: paramList[i - 1].conds[j].opt,
              range: [0, 0]
            }
          ];
          const newActions = [];

          // <1> 조건 반전
          // [1] 센서 범위가 디지털인 경우 [0,0], [1,1]
          if (this.isDigitalRange(paramList[i - 1].conds[j].range)) {
            newConds[0].range[0] = newConds[0].range[1]
                = this.digitalReverse(paramList[i - 1].conds[j].range[0]);
          } else {
            // [2] 아날로그 범위
            newConds[0].range[0] = paramList[i - 1].conds[j].range[1] + 1;
            newConds[0].range[1] = paramList[i - 1].conds[j].range[0] - 1;
          }

          // <2> 액션 추가
          // tslint:disable-next-line:prefer-for-of
          for (let k = 0; k < paramList[i].actions.length; k++) {
            newActions.push(paramList[i].actions[k]);
          }

          // 새로운 If문으로 추가
          paramList.push({type: newType, conds: newConds, actions: newActions});
        }
      }

      console.log('Convert3 Completed');
      this.printListFinal();
    }

    // else문 모두 제거
    for (let i = paramList.length - 1; i >= 0; i--) {
      if (paramList[i].type === 'ELSE') {
        paramList.splice(i, 1);
      }
    }
  }

  // JSON 치환 - 압축 1
  // 모든 list[i]에서 type 속성 제거
  compress1(paramList) {
    paramList.forEach( list => {
      if (list.hasOwnProperty('type')) {
        delete list.type;
      }
    });
  }

  // JSON 치환 - 압축 2
  // 모든 list[i].conds[j], list[i].actions[k]에서 name 속성 제거
  compress2(paramList) {

    paramList.forEach( list => {
      list.conds.forEach( cond => {
        if (cond.hasOwnProperty('name')) {
          delete cond.name;
        }
      });

      list.actions.forEach( action => {
        if (action.hasOwnProperty('name')) {
          delete action.name;
        }
      });
    });
  }

  // JSON 치환 - 마무리
  // list 개수에 따라 list_len 초기화, conds 개수에 따라 conds_len 초기화
  addLen(paramCode) {
    paramCode.list_len = paramCode.list.length;

    paramCode.list.forEach( list => {
      list.conds_len = list.conds.length;
      list.actions_len = list.actions.length;
    }); // endForEach

    console.log(paramCode);
  }

  // range가 digital인지 검사
  isDigitalRange(range) {
    return range[0] === range[1] &&
        (range[0] === 0 || range[0] === 1);
  }

  // 1 -> 0, 0 -> 1
  digitalReverse(num) {
    if (num === 0) {
      return 1;
    }
    return 0;
  }

  deepCopy = <T>(target: T): T => {
    if (target === null) {
      return target;
    }
    if (target instanceof Date) {
      return new Date(target.getTime()) as any;
    }
    if (target instanceof Array) {
      const cp = [] as any[];
      (target as any[]).forEach((v) => { cp.push(v); });
      return cp.map((n: any) => this.deepCopy<any>(n)) as any;
    }
    if (typeof target === 'object' && target !== {}) {
      const cp = { ...(target as { [key: string]: any }) } as { [key: string]: any };
      Object.keys(cp).forEach(k => {
        cp[k] = this.deepCopy<any>(cp[k]);
      });
      return cp as T;
    }
    return target;
  }

  printListCustom() {
    console.log('listCustom : ');
    console.log(this.listCustom);
  }

  printListFinal() {
    console.log('listFinal : ');
    console.log(this.listFinal);
  }

  printCode() {
    console.log('JSON Code : ');
    console.log(this.code);
  }

  // 이벤트 패킷 전송
  sendEvents() {

    // 예외처리 : 헤더가 없는 경우
    if (Global.headerInitalized === false) {
      alert('Header Data Is Missing');
      return;
    }

    // 1. 변환 (변환하지 않았던 경우에만)
    if (this.converted === false) {
      this.reconstructStatements();
    }

    // 2. 전송
    Global.httpAddEvent(this.http, this.code);

    alert('Sending Event Completed');
    console.log(this.code);
  }



  ngOnInit() {
    this.converted = false;
  }

}
