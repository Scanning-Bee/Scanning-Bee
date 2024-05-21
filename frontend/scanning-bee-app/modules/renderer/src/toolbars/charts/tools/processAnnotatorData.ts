import Annotation from '@frontend/models/annotation';

type AnnotatorData = [string, Annotation[]];

type AnnotatorChartData = {
    name: string;
    data: { [key: string]: number };
};

/**
 * processes the annotator data. takes annotator data and returns a chart data.
 * converts the user and annotation data that comes from the backend to a format that can be used by the chart.
 * the format is as follows:
 * {
 *  name: < string representation of the day >,
 *  [username]: < number of annotations by that user on that day >,
 * }
 * @param data
 */
export const processAnnotatorData = (data: AnnotatorData): AnnotatorChartData => null;
