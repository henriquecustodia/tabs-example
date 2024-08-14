import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  contentChild,
  contentChildren,
  Directive,
  NgModule,
  signal,
  TemplateRef,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appTabHeader]',
})
export class TabHeaderDirective {}

@Directive({
  standalone: true,
  selector: '[appTabContent]',
})
export class TabContentDirective {}

@Component({
  standalone: true,
  selector: 'app-tab',
  imports: [TabHeaderDirective, TabContentDirective],
  template: `<ng-content></ng-content> `,
})
export class TabComponent {
  header = contentChild.required(TabHeaderDirective, { read: TemplateRef });
  content = contentChild.required(TabContentDirective, { read: TemplateRef });
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-tabs',
  template: `
    <div role="tablist" class="tabs tabs-boxed">
      @for (tab of tabsData(); track $index) {
      <a
        role="tab"
        class="tab"
        [ngClass]="{ 'tab-active': $index === selectedTab() }"
        (click)="onSelectTab($index)"
      >
        <ng-container *ngTemplateOutlet="tab.header"></ng-container>
      </a>
      }
    </div>

    <ng-container *ngTemplateOutlet="selectedTabContent()"></ng-container>
  `,
})
export class TabsComponent {
  tabs = contentChildren(TabComponent);

  tabsData = computed(() => {
    return this.tabs().map(({ content, header }) => {
      return {
        header: header() as TemplateRef<unknown>,
        content: content() as TemplateRef<unknown>,
      };
    });
  });

  selectedTab = signal(0);

  selectedTabContent = computed(
    () => this.tabsData()[this.selectedTab()].content
  );

  onSelectTab(index: number) {
    this.selectedTab.set(index);
  }
}

@NgModule({
  imports: [
    TabsComponent,
    TabComponent,
    TabContentDirective,
    TabHeaderDirective,
  ],
  exports: [
    TabsComponent,
    TabComponent,
    TabContentDirective,
    TabHeaderDirective,
  ],
})
export class TabsModule {}

@Component({
  standalone: true,
  imports: [TabsModule],
  selector: 'app-root',
  template: `
    <div class="flex justify-center">
      <div class="w-full max-w-xs">
        <app-tabs>
          <app-tab>
            <ng-template appTabHeader>
              <h1>Minha Tab 1</h1>
            </ng-template>

            <ng-template appTabContent>
              <h1>Conteúdo da Tab 1</h1>
            </ng-template>
          </app-tab>

          <app-tab>
            <ng-template appTabHeader>
              <h1>Minha Tab 2</h1>
            </ng-template>

            <ng-template appTabContent>
              <h1>Conteúdo da Tab 2</h1>
            </ng-template>
          </app-tab>
        </app-tabs>
      </div>
    </div>
  `,
})
export class AppComponent {}
