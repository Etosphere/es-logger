import {Document, HeadingLevel, Packer, Paragraph, TextRun} from 'docx';
import Button from '@material-ui/core/Button';
import FileSaver from 'file-saver';
import {Block} from './LogParser';
import SaveAltIcon from '@material-ui/icons/SaveAlt';


export default function SaveToDocxButton(props) {
  let documentParagraphList = [];
  if (props.header.title) {
    documentParagraphList.push(new Paragraph({
      text: props.header.title,
      heading: HeadingLevel.HEADING_1
    }));
  }
  if (props.header.description) {
    props.header.description.split('\n').forEach((line) => {
      documentParagraphList.push(new Paragraph({
        children: [
          new TextRun({
            text: line.trim(),
            color: '666666'
          })
        ]
      }))
    });
  }

  const traverseTree = (node, depth) => {
    if (node.type !== Block) {
      if (node.content) {
        documentParagraphList.push(new Paragraph({
          children: [new TextRun({
            text: `<${props.roleTable.getName(node.role)}> ${node.content}`,
            color: props.roleTable.getColor(node.role).substring(1)
          })]
        }));
      }
    } else {
      if (Array.isArray(node.children)) {
        if (node.collapsed) {
          let roleList = node.role.map((roleID) => {
            if (props.roleTable.getType(roleID) === 'pc') {
              return props.roleTable.getName(roleID)
            } else {
              return null;
            }
          }).filter((roleName) => roleName);
          documentParagraphList.push(new Paragraph({
            heading: HeadingLevel.HEADING_2,
            text: `{${roleList.join(', ')}}`,
            outlineLevel: depth + 1,
          }));
          node.children.forEach((node) => traverseTree(node, depth + 1));
        } else {
          node.children.forEach((node) => traverseTree(node, depth));
        }
      }
    }
  }

  traverseTree(props.data, 0);

  let outputDocx = new Document({
    styles: {
      paragraphStyles: [{
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        run: {
          bold: true,
          size: 32,
          color: "000000",
        },
        paragraph: {
          spacing: {
            after: 120
          },
        },
      }, {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        run: {
          size: 26,
          color: "888888",
        },
      }, {
        id: "Normal",
        name: "Normal",
        basedOn: "Normal",
        next: "Normal",
        run: {
          size: 24,
        },
        paragraph: {
          spacing: {
            line: 288,
          },
        },
      }]
    },
    sections: [{
      children: documentParagraphList,
    }],
  });

  return (
    <Button
      color="secondary"
      variant="outlined"
      size="small"
      style={{marginBottom: "2px"}}
      endIcon={<SaveAltIcon/>}
      onClick={() => {
        Packer.toBlob(outputDocx).then((blob) => {
          // saveAs from FileSaver will download the file
          FileSaver.saveAs(blob, props.header.title ? props.header.title + '.docx' : 'rendered-log.docx');
        });
      }}>
      Save to docx
    </Button>
  );
}