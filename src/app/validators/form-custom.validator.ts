import { AppCluster } from './../app.shared.cluster';

export class FormValidator {
    public data: any
    private form: string
    private app: AppCluster
    public response = {}

    constructor(modelClass: any, formName: string) {
        this.app = new AppCluster()
        this.data =  new modelClass()
        this.form = formName
    }

    private invalidate(element: HTMLInputElement) {
        try {
            if (element.type == 'file') {
                var files = element.files
                if (files.length > 0) {
                    var selector = element.name.replace("[", "").replace("]", "")
                    if (element.parentElement.querySelector('#' + selector + '_label')) {
                        let label = element.parentElement.querySelector('#' + selector + '_label');
                        if (files.length > 1)
                            label.textContent = files.length + " Files Selected"
                        else
                            label.textContent = element.value
                    }
                    this.data[selector] = files;
                }
            } else {
                this.data[element.getAttribute('name')] = element.value
                if (element.value.length >= 1) {
                    this.removeError(element)
                } else {
                    this.setError(element);
                }
            }
        } catch (ex) {
            console.log("An error occured with Smart Validator, " + ex)
        }

    }
    private invalidateCheckElement(element: HTMLInputElement) {
        try {
            let tsElement = (<HTMLInputElement>element);
            this.data[tsElement.getAttribute('name')] = element.checked
            if (element.checked)
                this.removeError(tsElement)
            else
                this.setError(tsElement)
        } catch (ex) {
            console.log("An error occured with Smart Validator, " + ex)
        }

    }

    public revalidate() {
        var cf = (<HTMLFormElement>document.querySelector('[name=' + this.form + ']'))
        var HTMLElements = [];
        if (cf != null) {
            let els = cf.querySelectorAll('input,textarea,select')
            els.forEach(element => {
                HTMLElements.push(element)
            });
            HTMLElements.forEach(element => {
                if (element.type == "checkbox" || element.type == "radio") {
                    this.invalidateCheckElement(element)
                } else {
                    this.invalidate((<HTMLInputElement>element))
                }
            });
            return true
        }
        return false;
    }

    public validate(e) {
        let tsElement = (<HTMLInputElement>e.target)
        if (tsElement.type == "checkbox" || tsElement.type == "radio") {
            this.invalidateCheckElement(e.target)
        } else {
            this.invalidate(tsElement)
        }
    }

    private setError(element: HTMLInputElement) {
        if (element.getAttribute('required')) {
            let selector = element.name
            let tile = selector.replace("_", " ").replace("[", "").replace("]", "")
            let err = this.app.capitalize(tile.split(/(?=[A-Z])/).join(' ')) + ' Required'
            selector.replace("[", "").replace("]", "")

            let errpa = document.createElement("SMALL")
            let errnode = document.createTextNode(err)
            errpa.classList.add('error-description')
            errpa.id = selector + '-ng-err'
            errpa.appendChild(errnode)
            errpa.setAttribute('style', 'float:right;  font-size:16px; padding:5px; color:rgb(196, 58, 58)');
            element.classList.add("invalid")
            this.response[selector] = {
                remark: err,
                ok: false
            }
            if (element.type != "checkbox" && element.type != "radio") {
                if (element.parentElement.querySelector('#' + errpa.id))
                    (<HTMLParagraphElement>element.parentElement.querySelector('#' + errpa.id)).textContent = err
                else
                    element.parentElement.appendChild(errpa)
            }
        }
    }

    private removeError(element: HTMLInputElement) {
        if (element.getAttribute('required')) {
            let selector = element.getAttribute('name');
            let errpa = (<HTMLParagraphElement>element.parentElement.querySelector('#' + selector + '-ng-err'))
            element.classList.remove('invalid')
            if (element.parentElement.contains(errpa))
                element.parentElement.removeChild(errpa);

            this.response[selector] = {
                remark: "",
                ok: true
            }
        }
    }
}
