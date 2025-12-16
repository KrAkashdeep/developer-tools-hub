import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug, getCategoryBySlug, tools } from '@/lib/data/tools';
import Breadcrumb from '@/components/common/Breadcrumb';
import SectionHeader from '@/components/common/SectionHeader';
import ToolCard from '@/components/tools/ToolCard';
import { Badge } from '@/components/ui/badge';
import * as TablerIcons from '@tabler/icons-react';

// Import all tool components
import JsonFormatterTool from '@/components/tools/formatters/JsonFormatterTool';
import JsonMinifierTool from '@/components/tools/formatters/JsonMinifierTool';
import HtmlFormatterTool from '@/components/tools/formatters/HtmlFormatterTool';
import HtmlMinifierTool from '@/components/tools/formatters/HtmlMinifierTool';
import CssFormatterTool from '@/components/tools/formatters/CssFormatterTool';
import CssMinifierTool from '@/components/tools/formatters/CssMinifierTool';
import JsFormatterTool from '@/components/tools/formatters/JsFormatterTool';
import JsMinifierTool from '@/components/tools/formatters/JsMinifierTool';
import SqlBeautifierTool from '@/components/tools/formatters/SqlBeautifierTool';
import XmlFormatterTool from '@/components/tools/formatters/XmlFormatterTool';

import JsonValidatorTool from '@/components/tools/validators/JsonValidatorTool';
import HtmlValidatorTool from '@/components/tools/validators/HtmlValidatorTool';
import CssValidatorTool from '@/components/tools/validators/CssValidatorTool';
import UrlValidatorTool from '@/components/tools/validators/UrlValidatorTool';
import EmailValidatorTool from '@/components/tools/validators/EmailValidatorTool';
import IpValidatorTool from '@/components/tools/validators/IpValidatorTool';
import UuidValidatorTool from '@/components/tools/validators/UuidValidatorTool';
import CreditCardValidatorTool from '@/components/tools/validators/CreditCardValidatorTool';

import Base64EncodeTool from '@/components/tools/encoders/Base64EncodeTool';
import Base64DecodeTool from '@/components/tools/encoders/Base64DecodeTool';
import UrlEncodeTool from '@/components/tools/encoders/UrlEncodeTool';
import UrlDecodeTool from '@/components/tools/encoders/UrlDecodeTool';
import HtmlEncodeTool from '@/components/tools/encoders/HtmlEncodeTool';
import HtmlDecodeTool from '@/components/tools/encoders/HtmlDecodeTool';
import JwtDecoderTool from '@/components/tools/encoders/JwtDecoderTool';
import MorseEncodeTool from '@/components/tools/encoders/MorseEncodeTool';
import MorseDecodeTool from '@/components/tools/encoders/MorseDecodeTool';
import GzipCompressTool from '@/components/tools/encoders/GzipCompressTool';
import GzipDecompressTool from '@/components/tools/encoders/GzipDecompressTool';
import HashGeneratorTool from '@/components/tools/encoders/HashGeneratorTool';

import JsonToCsvTool from '@/components/tools/converters/JsonToCsvTool';
import CsvToJsonTool from '@/components/tools/converters/CsvToJsonTool';
import JsonToXmlTool from '@/components/tools/converters/JsonToXmlTool';
import XmlToJsonTool from '@/components/tools/converters/XmlToJsonTool';
import MarkdownToHtmlTool from '@/components/tools/converters/MarkdownToHtmlTool';
import HtmlToMarkdownTool from '@/components/tools/converters/HtmlToMarkdownTool';
import LoremGeneratorTool from '@/components/tools/converters/LoremGeneratorTool';
import EpochToDateTool from '@/components/tools/converters/EpochToDateTool';
import DateToEpochTool from '@/components/tools/converters/DateToEpochTool';
import HexToRgbTool from '@/components/tools/converters/HexToRgbTool';
import RgbToHexTool from '@/components/tools/converters/RgbToHexTool';
import UuidGeneratorTool from '@/components/tools/converters/UuidGeneratorTool';
import AsciiToTextTool from '@/components/tools/converters/AsciiToTextTool';
import TextToAsciiTool from '@/components/tools/converters/TextToAsciiTool';
import CaseConverterTool from '@/components/tools/converters/CaseConverterTool';
import SlugGeneratorTool from '@/components/tools/converters/SlugGeneratorTool';

import ColorPickerTool from '@/components/tools/colors/ColorPickerTool';
import GradientGeneratorTool from '@/components/tools/colors/GradientGeneratorTool';
import RandomColorTool from '@/components/tools/colors/RandomColorTool';
import ShadeGeneratorTool from '@/components/tools/colors/ShadeGeneratorTool';
import TintGeneratorTool from '@/components/tools/colors/TintGeneratorTool';
import PaletteExtractorTool from '@/components/tools/colors/PaletteExtractorTool';
import ContrastCheckerTool from '@/components/tools/colors/ContrastCheckerTool';
import HslHexConverterTool from '@/components/tools/colors/HslHexConverterTool';

import WordCounterTool from '@/components/tools/text/WordCounterTool';
import CharacterCounterTool from '@/components/tools/text/CharacterCounterTool';
import RemoveDuplicatesTool from '@/components/tools/text/RemoveDuplicatesTool';
import SortLinesTool from '@/components/tools/text/SortLinesTool';
import ReverseTextTool from '@/components/tools/text/ReverseTextTool';
import RemoveSpacesTool from '@/components/tools/text/RemoveSpacesTool';
import ExtractEmailsTool from '@/components/tools/text/ExtractEmailsTool';
import ExtractUrlsTool from '@/components/tools/text/ExtractUrlsTool';
import FindReplaceTool from '@/components/tools/text/FindReplaceTool';
import SentenceCaseTool from '@/components/tools/text/SentenceCaseTool';

import ImageCompressorTool from '@/components/tools/files/ImageCompressorTool';
import ImageResizerTool from '@/components/tools/files/ImageResizerTool';
import PdfToTextTool from '@/components/tools/files/PdfToTextTool';
import TextToPdfTool from '@/components/tools/files/TextToPdfTool';
import JsonToFileTool from '@/components/tools/files/JsonToFileTool';

import RegexTesterTool from '@/components/tools/code/RegexTesterTool';
import DiffCheckerTool from '@/components/tools/code/DiffCheckerTool';
import MarkdownPreviewerTool from '@/components/tools/code/MarkdownPreviewerTool';
import XmlViewerTool from '@/components/tools/code/XmlViewerTool';
import HtmlPreviewerTool from '@/components/tools/code/HtmlPreviewerTool';
import CssGradientPreviewerTool from '@/components/tools/code/CssGradientPreviewerTool';

import QrGeneratorTool from '@/components/tools/system/QrGeneratorTool';
import QrScannerTool from '@/components/tools/system/QrScannerTool';
import PasswordStrengthTool from '@/components/tools/system/PasswordStrengthTool';
import DeviceInfoTool from '@/components/tools/system/DeviceInfoTool';

interface ToolPageProps {
  params: {
    slug: string;
  };
}

// Map tool slugs to their components
const toolComponents: Record<string, React.ComponentType> = {
  // Formatters
  'json-formatter': JsonFormatterTool,
  'json-minifier': JsonMinifierTool,
  'html-formatter': HtmlFormatterTool,
  'html-minifier': HtmlMinifierTool,
  'css-formatter': CssFormatterTool,
  'css-minifier': CssMinifierTool,
  'js-formatter': JsFormatterTool,
  'js-minifier': JsMinifierTool,
  'sql-beautifier': SqlBeautifierTool,
  'xml-formatter': XmlFormatterTool,

  // Validators
  'json-validator': JsonValidatorTool,
  'html-validator': HtmlValidatorTool,
  'css-validator': CssValidatorTool,
  'url-validator': UrlValidatorTool,
  'email-validator': EmailValidatorTool,
  'ip-validator': IpValidatorTool,
  'uuid-validator': UuidValidatorTool,
  'credit-card-validator': CreditCardValidatorTool,

  // Encoders/Decoders
  'base64-encode': Base64EncodeTool,
  'base64-decode': Base64DecodeTool,
  'url-encode': UrlEncodeTool,
  'url-decode': UrlDecodeTool,
  'html-encode': HtmlEncodeTool,
  'html-decode': HtmlDecodeTool,
  'jwt-decoder': JwtDecoderTool,
  'morse-encode': MorseEncodeTool,
  'morse-decode': MorseDecodeTool,
  'gzip-compress': GzipCompressTool,
  'gzip-decompress': GzipDecompressTool,
  'hash-generator': HashGeneratorTool,

  // Converters
  'json-to-csv': JsonToCsvTool,
  'csv-to-json': CsvToJsonTool,
  'json-to-xml': JsonToXmlTool,
  'xml-to-json': XmlToJsonTool,
  'markdown-to-html': MarkdownToHtmlTool,
  'html-to-markdown': HtmlToMarkdownTool,
  'lorem-generator': LoremGeneratorTool,
  'epoch-to-date': EpochToDateTool,
  'date-to-epoch': DateToEpochTool,
  'hex-to-rgb': HexToRgbTool,
  'rgb-to-hex': RgbToHexTool,
  'uuid-generator': UuidGeneratorTool,
  'ascii-to-text': AsciiToTextTool,
  'text-to-ascii': TextToAsciiTool,
  'case-converter': CaseConverterTool,
  'slug-generator': SlugGeneratorTool,

  // Color Tools
  'color-picker': ColorPickerTool,
  'gradient-generator': GradientGeneratorTool,
  'random-color': RandomColorTool,
  'shade-generator': ShadeGeneratorTool,
  'tint-generator': TintGeneratorTool,
  'palette-extractor': PaletteExtractorTool,
  'contrast-checker': ContrastCheckerTool,
  'hsl-hex-converter': HslHexConverterTool,

  // Text Utilities
  'word-counter': WordCounterTool,
  'character-counter': CharacterCounterTool,
  'remove-duplicates': RemoveDuplicatesTool,
  'sort-lines': SortLinesTool,
  'reverse-text': ReverseTextTool,
  'remove-spaces': RemoveSpacesTool,
  'extract-emails': ExtractEmailsTool,
  'extract-urls': ExtractUrlsTool,
  'find-replace': FindReplaceTool,
  'sentence-case': SentenceCaseTool,

  // File Tools
  'image-compressor': ImageCompressorTool,
  'image-resizer': ImageResizerTool,
  'pdf-to-text': PdfToTextTool,
  'text-to-pdf': TextToPdfTool,
  'json-to-file': JsonToFileTool,

  // Code Tools
  'regex-tester': RegexTesterTool,
  'diff-checker': DiffCheckerTool,
  'markdown-previewer': MarkdownPreviewerTool,
  'xml-viewer': XmlViewerTool,
  'html-previewer': HtmlPreviewerTool,
  'css-gradient-previewer': CssGradientPreviewerTool,

  // System Tools
  'qr-generator': QrGeneratorTool,
  'qr-scanner': QrScannerTool,
  'password-strength': PasswordStrengthTool,
  'device-info': DeviceInfoTool,
};

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  
  if (!tool) {
    return {
      title: 'Tool Not Found - multidevTools',
    };
  }

  return {
    title: `${tool.name} - multidevTools`,
    description: tool.description,
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  
  if (!tool) {
    notFound();
  }

  const category = getCategoryBySlug(tool.category);
  const IconComponent = (TablerIcons as any)[tool.icon] || TablerIcons.IconTool;
  const ToolComponent = toolComponents[slug];

  if (!ToolComponent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tool Under Development</h1>
          <p className="text-muted-foreground">This tool is currently being developed.</p>
        </div>
      </div>
    );
  }

  // Get related tools from the same category
  const relatedTools = tools
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb 
        items={[
          { label: 'Tools', href: '/tools' },
          { label: category?.name || 'Category', href: `/tools?category=${tool.category}` },
          { label: tool.name }
        ]}
        className="mb-6"
      />

      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/10 rounded-lg">
          <IconComponent className="h-8 w-8 text-primary" />
        </div>
        <div>
          <SectionHeader 
            title={tool.name}
            description={tool.description}
          />
          {tool.popular && (
            <Badge variant="secondary" className="mt-2">
              Popular
            </Badge>
          )}
        </div>
      </div>

      {/* Tool Component */}
      <div className="mb-12">
        <ToolComponent />
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section>
          <SectionHeader 
            title="Related Tools"
            description="Other tools in this category"
            className="mb-6"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedTools.map((relatedTool) => (
              <ToolCard key={relatedTool.id} tool={relatedTool} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}