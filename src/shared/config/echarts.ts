/**
 * ECharts — modular ESM registration
 *
 * WHY modular imports:
 * Full `echarts` bundle is ~1MB. Importing from `echarts/core` + individual
 * charts/components lets the bundler tree-shake. Only what we register here
 * ships to the client.
 *
 * WHY central registration:
 * Each chart type + component must be registered exactly once. Doing it
 * per-widget leads to duplicate registrations and larger bundles. Everything
 * widgets need goes through this file.
 *
 * To use ECharts: widgets import `<ReactECharts />` from `echarts-for-react`
 * and it will find registered components globally. They do NOT import from
 * `echarts/core` directly.
 *
 * Adding a new chart type / component: add the import here, add to the
 * `echarts.use([...])` array, done.
 */

import * as echarts from "echarts/core";
import {
  LineChart,
  BarChart,
  PieChart,
  HeatmapChart,
  type LineSeriesOption,
  type BarSeriesOption,
  type PieSeriesOption,
  type HeatmapSeriesOption,
} from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DatasetComponent,
  TransformComponent,
  VisualMapComponent,
  type GridComponentOption,
  type TooltipComponentOption,
  type LegendComponentOption,
  type TitleComponentOption,
  type VisualMapComponentOption,
} from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  LineChart,
  BarChart,
  PieChart,
  HeatmapChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DatasetComponent,
  TransformComponent,
  VisualMapComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

/**
 * Composed ECharts option type.
 *
 * WHY a composed type:
 * ECharts' default `EChartsOption` includes every series type, forcing widgets
 * to narrow it. This type includes only the series + components we register,
 * giving widgets accurate autocomplete and type safety without `as` casts.
 */
export type ECOption = echarts.ComposeOption<
  | LineSeriesOption
  | BarSeriesOption
  | PieSeriesOption
  | HeatmapSeriesOption
  | GridComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | TitleComponentOption
  | VisualMapComponentOption
>;

export { echarts };
