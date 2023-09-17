
import { Injectable } from '@angular/core';
import { CourseSection } from '@course-platform/shared/interfaces';
import { ComponentStore } from "@ngrx/component-store";

export interface SectionsState {
    sections: CourseSection[];
    isLoadingCourseSections: boolean;
    loadCourseSectionsError: Error | null;
}

@Injectable({ providedIn: 'root' })
export class SectionsStateService extends ComponentStore<SectionsState> {

    readonly sections$ = this.select(state => state.sections);
    readonly isLoadingCourseSections$ = this.select(state => state.isLoadingCourseSections);
    readonly loadCourseSectionsError$ = this.select(state => state.loadCourseSectionsError);

    setSections = this.updater((state, sections: CourseSection[]) => ({
        ...state,
        sections,
        isLoadingCourseSections: false,
        loadCourseSectionsError: null
    }));

    setIsLoadingCourseSections = this.updater((state, isLoadingCourseSections: boolean) => ({
        ...state,
        isLoadingCourseSections: isLoadingCourseSections
    }));

    setLoadCourseSectionsError = this.updater((state, loadCourseSectionsError: Error) => ({
        ...state,
        loadCourseSectionsError: loadCourseSectionsError
    }));

    constructor() {
        super({
            sections: [],
            isLoadingCourseSections: false,
            loadCourseSectionsError: null
        });
    }

}