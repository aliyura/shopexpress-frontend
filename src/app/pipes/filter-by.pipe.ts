import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {

  transform(list: Array<any>, property: string, value: any): Array<any> {
   
    if(!list){
      return null;
    }
    const filteredList = list.filter(item => item[property] == value)
   
    return filteredList;
  }

}
