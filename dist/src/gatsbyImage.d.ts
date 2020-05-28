import { GatsbyFixedImageProps, GatsbyFluidImageProps, GatsbyImageFixedArgs, GatsbyImageFluidArgs, NormalizedImageField } from './types';
export declare const buildFixedGatsbyImage: (url: string, sourceWidth: number, sourceHeight: number, args?: GatsbyImageFixedArgs) => GatsbyFixedImageProps;
export declare const buildFluidGatsbyImage: (url: string, sourceWidth: number, sourceHeight: number, args?: GatsbyImageFluidArgs) => GatsbyFluidImageProps;
export declare const resolvers: {
    PrismicImageType: {
        fixed: {
            resolve: (source: NormalizedImageField, args: GatsbyImageFixedArgs) => GatsbyFixedImageProps | undefined;
        };
        fluid: {
            resolve: (source: NormalizedImageField, args: GatsbyImageFluidArgs) => GatsbyFluidImageProps | undefined;
        };
    };
    PrismicImageThumbnailType: {
        fixed: {
            resolve: (source: NormalizedImageField, args: GatsbyImageFixedArgs) => GatsbyFixedImageProps | undefined;
        };
        fluid: {
            resolve: (source: NormalizedImageField, args: GatsbyImageFluidArgs) => GatsbyFluidImageProps | undefined;
        };
    };
};
