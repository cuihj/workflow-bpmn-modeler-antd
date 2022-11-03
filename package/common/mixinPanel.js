
import showConfig from '../flowable/showConfig'
export default {
  components: {},
  props: {
    modeler: {
      type: Object,
      required: true
    },
    element: {
      type: Object,
      required: true
    },
    categorys: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    // 'formData.documentation': {
    //   deep: true,
    //   immediate: true,
    //   handler (obj,a) {     //数据改变之后执行的事情
    //     console.log(obj)
    //     console.log(a)
    //     // if(obj.documentation) {
    //     //   if (!val) {
    //     //     this.updateProperties({ documentation: [] })
    //     //     return
    //     //   }
    //     //   const documentationElement = this.modeler.get('moddle').create('bpmn:Documentation', { text: val })
    //     //   this.updateProperties({ documentation: [documentationElement] })
    //     // }
    //   }
    // }
  // 'formData.id': function(val) {
  //     this.updateProperties({ id: val })
  //   },
  //   'formData.name': function(val) {
  //     console.log(val)
  //     this.updateProperties({ name: val })
  //   },
  //   'formData.color': function(val) {
  //     this.setColor({ fill: val, stroke: val })
  //     this.updateProperties({ color: val })
  //   },
  //   'formData.documentation': function(val) {
  //     console.log(val)
  //     if (!val) {
  //       this.updateProperties({ documentation: [] })
  //       return
  //     }
  //     const documentationElement = this.modeler.get('moddle').create('bpmn:Documentation', { text: val })
  //     this.updateProperties({ documentation: [documentationElement] })
  //   }
  },
  methods: {
    updateProperties(properties) {
      const modeling = this.modeler.get('modeling')
      modeling.updateProperties(this.element, properties)
    },
    updateCommonProperties(values){
      if (values.hasOwnProperty('id')) {
        let val = values.id
        this.updateProperties({ id: val })
      } else if (values.hasOwnProperty('templateId')) {
        let val = values.templateId
        this.updateProperties({ 'flowable:templateId': val })
      } else if (values.hasOwnProperty('form')) {
        let val = values.form
        this.updateProperties({ 'flowable:form': val })
      } else if (values.hasOwnProperty('schema')) {
        let val = values.schema
        this.updateProperties({ 'flowable:schema': val })
      } else if (values.hasOwnProperty('api')) {
        let val = values.api
        this.updateProperties({ 'flowable:api': val })
      } else if (values.hasOwnProperty('revert')) {
        let val = values.revert
        this.updateProperties({ 'flowable:revert': val })
      } else if (values.hasOwnProperty('image')) {
        let val = values.image
        this.updateProperties({ 'flowable:image': val })
      }
    },
    setColor(properties) {
      const modeling = this.modeler.get('modeling')
      modeling.setColor(this.element, properties)
    }
  },
  computed: {
    elementType() {
      const bizObj = this.element.businessObject
      return bizObj.eventDefinitions
        ? bizObj.eventDefinitions[0].$type
        : bizObj.$type
    },
    showConfig() {
      return showConfig[this.elementType] || {}
    }
  }
}
