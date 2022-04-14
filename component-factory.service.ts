import {
  ApplicationRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector
} from '@angular/core';
import { ComponentType } from '../types/core.type';

@Injectable({
  providedIn: 'root'
})
export class ComponentFactoryService {
  private components: ComponentRef<any>[] = [];

  constructor(
    private appRef: ApplicationRef,
    private resolver: ComponentFactoryResolver,
    private injector: Injector
  ) { }

  public add<T>(_componentRef: ComponentRef<T>, _element?: Element | string): void {
    this.appRef.attachView(_componentRef.hostView);

    if (typeof _element === 'string')
      _element = document.querySelector(_element)!;

    if (!_element)
      _element = document.body;

    _element.appendChild((_componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement);

    this.components.push(_componentRef);
  }

  public clear(): void {
    while (this.components.length > 0)
      this._remove(this.components.pop()!);
  }

  public getComponent<T>(_component: ComponentType<T> | ComponentRef<T>): ComponentRef<T> {
    return _component instanceof ComponentRef ? _component : this.resolver.resolveComponentFactory(_component).create(this.injector);
  }

  public getComponentFactory<T>(_component: ComponentType<T>): ComponentFactory<T> {
    return this.resolver.resolveComponentFactory(_component);
  }

  public getIndex(_componentRef: ComponentRef<any>): number {
    return this.components.indexOf(_componentRef);
  }

  public remove(_dialog: number | ComponentRef<any>): boolean {
    let componentRef;
    
    if (typeof _dialog === 'number' && this.components.length > _dialog)  {
      componentRef = this.components.splice(_dialog, 1)[0];
    } else {
      for (const cr of this.components) {
        if (cr === _dialog)
          componentRef = cr;
      }
    }

    if (componentRef) {
      this._remove(componentRef);
      return true;
    }
    
    return false;
  }

  private _remove(_componentRef: ComponentRef<any>) {
    this.appRef.detachView(_componentRef.hostView);
    _componentRef.destroy();
  }
}
