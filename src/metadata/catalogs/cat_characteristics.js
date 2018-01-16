/**
 * ### Дополнительные методы справочника Характеристики
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module cat_characteristics
 */

export default function ($p) {

  //Добавляем свойства характеристике
  $p.CatCharacteristics.prototype.__define({
    //содержит свойства, необходимые для работы микросервиса планирования
    //перечень свойств можно расширить, добавив недостающие в возвращаемый объект
    props_for_plan: {
      get: function () {
        // разыменовываем
        const {specification, constructions, sys} = this;

        //Фурнитура
        const furns = $p.wsql.alasql("select first(furn) as furn from ? where furn <> ?", [constructions._obj, $p.utils.blank.guid]);

        const res = {
          sys: sys,
          furn: furns.length ? $p.cat.furns.get(furns[0].furn) : $p.utils.blank,
          crooked: false,
          colored: false,
          lay: false,
          made_to_order: false,
          packing: false,
          days_to_execution: 0
        };

        const noms = new Set();
        specification.forEach(({nom})=>{
          // если такая номенклатура уже была, не пытаемся подмешивать её свойства еще раз
          if(noms.has(nom)){
            return;
          }
          noms.add(nom);

          res.crooked = res.crooked || !!nom.crooked;
          res.colored = res.colored || !!nom.colored;
          res.lay = res.lay || !!nom.lay;
          res.made_to_order = res.made_to_order || !!nom.made_to_order;
          res.packing = res.packing || !!nom.packing;
          if(nom.days_to_execution > res.days_to_execution){
            res.days_to_execution = res.days_to_execution;
          }
        })

        return res;
      }
    }
    }
  )
}
